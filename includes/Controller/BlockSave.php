<?php

namespace Quantum\Viewports\Controller;

// Be sure not to load without wp.
defined( 'ABSPATH' ) || exit;

/**
 * This class handles block save.
 *
 * @class    Quantum\Viewports\BlockSave
 * @package  Quantum\Viewports
 * @category Class
 * @author   Sebastian Buchwald // conversionmedia GmbH & Co. KG
 */
class BlockSave extends Instance {

	/**
	 * Property contains invalid post_types.
	 */
	protected $invalid_post_types = null;


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
		\add_filter( 'wp_insert_post_data', [ $this, 'wp_insert_post_data' ], 10, 2 );
	}


	/**
	 * Method to filter "wp_insert_post_data".
	 *
	 * @param array $data
	 * @param array $postarr
	 *
	 * @return array
	 */
	public function wp_insert_post_data( $data, $postarr ) : array
	{
		// Ignore invalid post_types.
		if( in_array( $postarr[ 'post_type' ], $this->get_invalid_post_types() ) ) {
			return $data;
		}

		// Prepare blocks for modification.
		$blocks = \parse_blocks( \stripslashes( $postarr[ 'post_content' ] ) );
		$blocksModified = BlockProcessor::modifySavedBlocks( $blocks );

		// Prepare modified blocks for saving.
		$data[ 'post_content' ] = addslashes( \serialize_blocks( $blocksModified ) );
		return $data;
	}


	/**
	 * Method to return invalid post_types.
	 *
	 * @return array
	 */
	public function get_invalid_post_types() : array
	{
		if( null === $this->invalid_post_types ) {
			$invalid_post_types = [
				'wp_global_styles',
				'wp_font_family',
				'wp_font_face',
			];
			$this->invalid_post_types = \apply_filters( 'quantum_viewports_invalid_post_types', $invalid_post_types );
		}

		return $this->invalid_post_types;
	}
}