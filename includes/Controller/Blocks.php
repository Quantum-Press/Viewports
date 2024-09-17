<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * Blocks class.
 *
 * This class handles block manipulations.
 *
 * @class    Quantum\Viewports\Blocks
 * @since    0.2.15
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class Blocks extends Instance {

	/**
	 * Method to construct.
	 *
	 * @since 0.2.15
	 */
	protected function __construct()
	{
		$this->set_hooks();
	}


	/**
	 * Method to set hooks.
	 *
	 * @since 0.2.15
	 */
	protected function set_hooks()
	{
		\add_filter( 'register_block_type_args', [ $this, 'register_block_type_args' ], 10, 2 );
		\add_filter( 'safe_style_css', [ $this, 'safe_style_css' ], 10, 1 );
	}


	/**
	 * Method to register viewports support to all block attributes.
	 *
	 * @param object (required) $block_type containing base config
	 *
	 * @since 0.2.15
	 *
	 * @return object containing filtered block_type
	 */
	public function register_block_type_args( $args, $block_type )
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

		if ( ! isset( $args[ 'attributes' ][ 'tempId' ] ) ) {
			$args[ 'attributes' ][ 'tempId' ] = [
				'type' => 'string',
			];
		}

		return $args;
	}


	/**
	 * Method to extend the list of supported css properties.
	 *
	 * @param array $styles
	 *
	 * @since 0.2.15
	 *
	 * @return array
	 */
	public function safe_style_css( $styles )
	{
		$styles[] = 'display';
		$styles[] = 'background-repeat';

		return $styles;
	}
}
