<?php declare( strict_types = 1 );

namespace QP\Viewports\Model;

use PHPUnit\Framework\TestCase;


final class CSSRuleSetTest extends TestCase {


	/**
	 * Method to test constructor on emptyness.
	 *
	 * @dataProvider emptyConstructorProvider
	 */
	public function testEmptyConstructor( array $block )
	{
		$cssRuleset = new CSSRuleSet( $block );

		$this->assertEmpty( $cssRuleset->getRules() );
	}


	/**
	 * Method to test constructor on emptyness.
	 *
	 * @dataProvider generateRulesProvider
	 */
	public function testGeneratingRules( array $block )
	{
		$cssRuleset = new CSSRuleSet( $block );

		$this->assertEmpty( $cssRuleset->getRules() );
	}



	/**
	 * Method to test falsy magic method __get.
	 *
	 * @dataProvider emptyConstructorProvider
	 *
	 *
	public function testFalsyGet( mixed $object_id, mixed $object_data, mixed $store ) : void
	{
		$object = new DB_Object( $object_id, $object_data, $store );

		$this->expectException( 'Exception' );
		$this->assertNull( $object->saruman );
	}



	/**
	 * Method to test falsy magic method __isset.
	 *
	 * @dataProvider emptyConstructorProvider
	 *
	public function testFalsyIsset( mixed $object_id, mixed $object_data, mixed $store ) : void
	{
		$object = new DB_Object( $object_id, $object_data, $store );

		$this->assertFalse( isset( $object->gimli ) );
	}
	/**/



	/**
	 * Static Data provider for empty constructor cases.
	 */
	public static function emptyConstructorProvider() : array
	{
		return [
			[
				[],
			],
			[ [
				'blockName' => [],
			] ],
			[ [
				'innerHTML' => [],
			] ],
			[ [
				'attrs' => [],
			] ],
			[ [
				'blockName' => '',
				'innerHTML' => '',
				'attrs' => [],
			] ],
			[ [
				'blockName' => 'core/group',
				'innerHTML' => '',
				'attrs' => [],
			] ],
			[ [
				'blockName' => 'core/group',
				'innerHTML' => '<div class=""></div>',
				'attrs' => [],
			] ],
		];
	}


	public function generateRulesProvider(): array
	{
		return [
			[ [
				'blockName' => 'core/group',
				'innerHTML' => '<div class="wp-block-group" style="min-height: 300px; padding-top: var(--wp--preset--spacing--40); padding-bottom: var(--wp--preset--spacing--40)"></div>',
				'attrs' => [
					'style' => [
						'background' => [
							'backgroundImage' => [
								'url' => 'test.png',
								'id' => '16',
								'source' => 'file',
								'title' => 'test',
							],
							'backgroundSize' => 'cover',
						],
						'spacing' => [
							'padding' => [
								'top' => 'var:preset|spacing|40',
								'bottom' => 'var:preset|spacing|40',
							],
						],
						'dimensions' => [
							'minHeight' => '300px',
						],
					],
					'viewports' => [
						'1360' => [
							'style' => [
								'spacing' => [
									'padding' => [
										'top' => 'var:preset|spacing|50',
										'bottom' => 'var:preset|spacing|50',
									],
								],
							],
						],
					],
					'inlineStyles' => [
						'0' => [
							'background' => [
								[
									'priority' => 5,
									'css' => '%{background-image: url( "test.jpg" ); background-size: cover;}',
									'from' => '0',
									'to' => '-1',
								]
							],
							'spacing' => [
								[
									'priority' => 5,
									'css' => '%{padding-top: var(--wp--preset--spacing--40); padding-bottom: var(--wp--preset--spacing--40);}',
									'from' => '0',
									'to' => '-1',
								]
							],
							'dimensions' => [
								[
									'priority' => 5,
									'css' => '%{min-height: 300px;}',
									'from' => '0',
									'to' => '-1',
								]
							],
						],
						'1360' => [
							'spacing' => [
								[
									'priority' => 5,
									'css' => '%{padding-top: var(--wp--preset--spacing--50); padding-bottom: var(--wp--preset--spacing--50);}',
									'from' => '1360',
									'to' => '-1',
								],
							],
						],
					],
				],
			] ],
		];
	}
}