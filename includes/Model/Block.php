<?php

namespace Quantum\Viewports\Model;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

use Quantum\Viewports\Controller\BlockProcessor;
use Quantum\Viewports\Controller\CSSParser;

/**
 * This model class handles a single block.
 *
 * @class    Quantum\Viewports\Model\Block
 * @package  Quantum\Viewports\Model\
 * @category Class
 */
class Block {

	/**
	 * Property contains block name
	 *
	 * @var string
	 */
	public string $blockName = '';

	/**
	 * Property contains block attributes.
	 *
	 * @var array
	 */
	public array $attrs = [];

	/**
	 * Property contains block innerHTML.
	 *
	 * @var string
	 */
	public string $innerHTML = '';

	/**
	 * Property contains block innerContent.
	 *
	 * @var array
	 */
	public array $innerContent = [];

	/**
	 * Property contains block innerBlocks.
	 *
	 * @var array
	 */
	public array $innerBlocks = [];

	/**
	 * Property contains options.
	 *
	 * @var array
	 */
	public array $options = [];

	/**
	 * Property contains CSSuleset object.
	 *
	 * @var null|CSSRuleset
	 */
	public null|CSSRuleset $cssRuleset = null;


	/**
	 * Constructor to build block object.
	 *
	 * @param string $blockName
	 * @param array $attrs
	 * @param string $innerHTML
	 * @param array $innerContent
	 * @param array $innerBlocks
	 */
	public function __construct(
		string $blockName,
		array $attrs = [],
		string $innerHTML = '',
		array $innerContent = [],
		array $innerBlocks = []
	) {
		$this->blockName = $blockName;

		$this->attrs = $this->sanitizeAttrs( $attrs );

		$this->innerHTML = $innerHTML;
		$this->innerContent = $innerContent;
		$this->innerBlocks = $innerBlocks;

		$this->options = BlockProcessor::getOptions();

		$this->cssRuleset = new CSSRuleset( [
			'blockName' => $this->blockName,
			'innerHTML' => $this->innerHTML,
			'attrs' => $this->attrs,
		] );
	}


	/**
	 * Method to sanitize attributes.
	 *
	 * @param array $attrs
	 *
	 * @return array
	 */
	protected function sanitizeAttrs( $attrs ) : array
	{
		// Shift the default viewport=0 to style attribute. It can differ by viewport simulation.
		if( isset( $attrs[ 'viewports' ][ 0 ][ 'style' ] ) ) {
			$attrs[ 'style' ] = $attrs[ 'viewports' ][ 0 ][ 'style' ];
			unset( $attrs[ 'viewports' ][ 0 ] );
		}

		return $attrs;
	}


	/**
	 * Method to set innerBlocks to Block objects.
	 */
	public function setInnerBlocks()
	{
		if( is_array( reset( $this->innerBlocks ) ) ) {
			$this->innerBlocks = BlockProcessor::generateBlocks( $this->innerBlocks );
		}
	}


	/**
	 * Method to return inner blocks.
	 *
	 * @return Block[]
	 */
	public function getInnerBlocks() : array
	{
		return $this->innerBlocks;
	}


	/**
	 * Method to modify block settings for save.
	 */
	public function modifySave()
	{

		// Cleanup the tempId - it will only get used in React Runtime.
		if( isset( $this->attrs[ 'tempId' ] ) ) {
			unset( $this->attrs[ 'tempId' ] );
		}

		// Modify inline styles if there are styles.
		if( isset( $this->attrs[ 'style' ] ) ) {
			$this->modifySaveStyles();
		}

		// Modify innerBlocks recursive.
		if( ! empty( $this->innerBlocks ) ) {
			$this->setInnerBlocks();

			foreach( $this->innerBlocks as &$block ) {
				$block->modifySave();
			}
		}
	}


	/**
	 * Method to modify block styles for save.
	 */
	public function modifySaveStyles()
	{
		$this->cssRuleset->cleanupAttributeRules( $this->options[ 'ignore_properties' ] );
		$this->cssRuleset->cleanupInlineRules();
		$this->cssRuleset->compress();

		$inlineStyleRules = $this->cssRuleset->getInlineStyleRules();
		if( empty( $inlineStyleRules ) ) {
			$this->resetInlineStyles();
			return;
		}

		foreach( $inlineStyleRules as $cssRule ) {
			$this->modifySaveHTML( $cssRule );
		}
	}


	/**
	 * Method to modify save html by cssRule.
	 *
	 * @param CSSRule $cssRule
	 */
	private function modifySaveHTML( $cssRule )
	{

		// Set selector parts depending on selector depth.
		$selector = $cssRule->getSelector();
		if( '%' === $selector ) {
			$selectorParts = [ '%' ];
		} else {
			$selectorParts = CSSParser::getSelectorParts( $selector );
		}

		// Start processing at the outer selector.
		$modifyNestedSelector = function( &$html, $selectorParts ) use ( &$cssRule, &$modifyNestedSelector ) {
			if( empty( $selectorParts ) ) {
				return;
			}

			// Set the current selectorPart.
			$currentSelector = array_shift( $selectorParts ); // Hole den aktuellen Selektor-Teil
			$currentSelectorParts = explode( '.', $currentSelector ); // Teile in Tag und Klassen auf
			$tagName = array_shift( $currentSelectorParts );
			$className = implode( '.', $currentSelectorParts );

			// Set processor to iterate over.
			$processor = new \WP_HTML_Tag_Processor( $html );
			$processor->next_tag();

			// Break out on wildcard only.
			if( empty( $selectorParts ) && '%' === $tagName ) {
				$processor->set_attribute( 'style', $cssRule->getCompressedPropertiesCSS() );
				$html = (string) $processor;

				return;
			}

			// Find matching elements for the current selector part
			while( $processor->next_tag( [ $tagName ] ) ) {

				// Check if tagName matches.
				$currentTagName = strtolower( $processor->get_tag() );
				if( $tagName !== $currentTagName ) {
					continue;
				}

				// Check if optional className matches.
				if( $className && ! $processor->has_class( $className ) ) {
					continue;
				}

				// Check if last selector part reached.
				if( empty( $selectorParts ) ) {
					$processor->set_attribute( 'style', $cssRule->getCompressedPropertiesCSS() );
					$html = (string) $processor;

				} else {

					// Extract the inner HTML manually
					$innerHTML = CSSParser::extractInnerHTML( $html, $tagName );
					$modifyNestedSelector( $innerHTML, $selectorParts );
					$html = CSSParser::replaceInnerHTML( $html, $innerHTML, $tagName );
				}
			}
		};

		$modifyNestedSelector( $this->innerHTML, $selectorParts );

		if( isset( $this->innerContent[ 0 ] ) ) {
			$modifyNestedSelector( $this->innerContent[ 0 ], $selectorParts );
		}
	}



	/**
	 * Method to reset inline styles on innerHTML.
	 */
	public function resetInlineStyles()
	{
		$processor = new \WP_HTML_Tag_Processor( $this->innerHTML );
		$processor->next_tag();
		$processor->remove_attribute( 'style' );

		$this->innerHTML = (string) $processor;

		if( isset( $this->innerContent[ 0 ] ) ) {
			$processor = new \WP_HTML_Tag_Processor( $this->innerContent[ 0 ] );
			$processor->next_tag();
			$processor->remove_attribute( 'style' );

			$this->innerContent[ 0 ] = (string) $processor;
		}
	}


	/**
	 * Method to return serialized block information.
	 *
	 * @return array
	 */
	public function getSerializedBlock() : array
	{
		$innerBlocks = [];

		if( ! empty( $this->innerBlocks ) ) {
			$this->setInnerBlocks();

			foreach( $this->innerBlocks as $block ) {
				$innerBlocks[] = $block->getSerializedBlock();
			}
		}

		return [
			'blockName' => $this->blockName,
			'attrs' => $this->attrs,
			'innerHTML' => $this->innerHTML,
			'innerContent' => $this->innerContent,
			'innerBlocks' => $innerBlocks,
		];
	}
}
