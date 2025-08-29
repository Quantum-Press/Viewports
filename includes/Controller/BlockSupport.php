<?php

namespace QP\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * This class handles block support attributes and styles.
 *
 * @class    QP\Viewports\BlockSupport
 * @package  QP\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class BlockSupport extends Instance {

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
		\add_filter( 'register_block_type_args', [ $this, 'registerBlockTypeArgs' ], 10, 2 );
		\add_filter( 'safe_style_css', [ $this, 'safeStyleCSS' ], 10, 1 );
	}


	/**
	 * Method to register viewports support to all block attributes.
	 *
	 * @param object (required) $block_type containing base config
	 *
	 * @return object containing filtered block_type
	 */
	public function registerBlockTypeArgs( $args, $block_type )
	{
		if ( ! isset( $args[ 'attributes' ][ 'viewports' ] ) ) {
			$args[ 'attributes' ][ 'viewports' ] = [
				'type' => 'object',
			];
		}

		if ( ! isset( $args[ 'attributes' ][ 'inlineStyles' ] ) ) {
			$args[ 'attributes' ][ 'inlineStyles' ] = [
				'type' => 'object',
			];
		}

		return $args;
	}


	/**
	 * Method to extend the list of supported css properties.
	 *
	 * @param array $styles
	 *
	 * @return array
	 */
	public function safeStyleCSS( $styles )
	{
		$styles[] = 'display';
		$styles[] = 'background-repeat';

		return $styles;
	}
}
