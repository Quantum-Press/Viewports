<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

use Quantum\Viewports\Model\CSSRuleset;

class BlockRender extends Instance {

	/**
	 * Method to construct.
	 */
	protected function __construct()
	{
		$this->set_hooks();
	}


	/**
	 * Method to set hooks.
	 */
	protected function set_hooks()
	{
		\add_filter( 'render_block', [ $this, 'renderBlock' ], 20, 2 );
		\add_action( 'wp_enqueue_scripts', [ $this, 'enqueueBlockStyles' ], 20 );
	}


	/**
	 * Method to hook into block rendering to collect its css.
	 *
	 * @param string $block_html
	 * @param array $block
	 *
	 * @return string
	 */
	public function renderBlock( $block_html, $block ) : string
	{
		// Set style css sources and check if there is some css to render.
		if( ! isset( $block[ 'attrs' ][ 'inlineStyles' ] ) || empty( $block[ 'attrs' ][ 'inlineStyles' ] ) ) {
			return $block_html;
		}

		$block[ 'innerHTML' ] = $block_html;

		$ruleSet = new CSSRuleset( $block );
		$ruleSet->compress();

		$className = \wp_unique_id( 'qp-viewports-' );
		$selector = 'body .wp-site-blocks .' . $className;

		$css = $ruleSet->getCSS( $selector );

		$this->registerCSS( $css );

		return $ruleSet->getBlockHTML( $className );
	}


	/**
	 * Method to register css.
	 *
	 * @param string $css
	 */
	protected function registerCSS( $css )
	{
		global $qpViewportsStyles;

		$qpViewportsStyles .= $css;
	}


	/**
	 * Method to enqueue styles registered before.
	 */
	public function enqueueBlockStyles()
	{
		global $qpViewportsStyles;

		if ( empty( $qpViewportsStyles ) ) {
			return;
		}

		\wp_register_style( 'qp-viewports-inline-css', false );
		\wp_add_inline_style( 'qp-viewports-inline-css', $qpViewportsStyles );
		\wp_enqueue_style( 'qp-viewports-inline-css' );
	}
}