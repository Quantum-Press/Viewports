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
		// Prepare blocks for modification.
		$blocks = \parse_blocks( \stripslashes( $postarr[ 'post_content' ] ) );
		$blocksModified = BlockProcessor::modifySavedBlocks( $blocks );

		// Prepare modified blocks for saving.
		$data[ 'post_content' ] = addslashes( \serialize_blocks( $blocksModified ) );
		return $data;
	}
}