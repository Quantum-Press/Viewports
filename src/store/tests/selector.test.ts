// Import preparement dependencies.
import deepFreeze from 'deep-freeze';
import * as lodash from 'lodash';

// Extend global window object.
global.window[ 'lodash' ] = lodash;

// Import test environment.
import { describe, expect, test } from '@jest/globals';

// Import store parts.
import * as selectors from '../selectors';
import { DEFAULT_STATE } from '../default';

// Deconstruct functions to test.
const {
	getViewports,
	getViewport,
	getDesktop,
	getTablet,
	getMobile,
	isLoading,
	isSaving,
	isAutoSaving,
	isActive,
	isInspecting,
	inspectorPosition,
	inDesktopRange,
	inTabletRange,
	inMobileRange,
	hasBlockViewports,
	getSaves,
	getBlockSaves,
	getGeneratedBlockSaves,
	getChanges,
	getBlockChanges,
	getBlockDefaults,
	getValids,
	getBlockValids,
	getViewportValids,
	getViewportBlockValids,
	getRemoves,
	getBlockRemoves,
	getLastEdit,
	getRendererPropertySet,
	getRendererSet,
	needsRenderer,
	hasRenderer,
} = selectors;


describe( 'test store selectors', () => {

	describe( 'viewports', () => {
		test( 'can getViewports()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewports: {
					375: 'Mobile',
					768: 'Tablet',
					1360: 'Desktop',
				}
			} );

			const check = {
				375: 'Mobile',
				768: 'Tablet',
				1360: 'Desktop',
			};

			const result = getViewports( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getViewport()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 375,
			} );

			const check = 375;
			const result = getViewport( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getDesktop()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				desktop: 1360,
			} );

			const check = 1360;
			const result = getDesktop( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getTablet()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				tablet: 820,
			} );

			const check = 820;
			const result = getTablet( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getMobile()', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				mobile: 320,
			} );

			const check = 320;
			const result = getMobile( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can indicate isLoading() falsy', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: false,
			} );

			const result = isLoading( state );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate isLoading() truely', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isLoading: true,
			} );

			const result = isLoading( state );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate isSaving() falsy', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isSaving: false,
			} );

			const result = isSaving( state );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate isSaving() truely', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isSaving: true,
			} );

			const result = isSaving( state );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate isAutoSaving() falsy', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isAutoSaving: false,
			} );

			const result = isAutoSaving( state );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate isAutoSaving() truely', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isAutoSaving: true,
			} );

			const result = isAutoSaving( state );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate isActive() falsy', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: false,
			} );

			const result = isActive( state );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate isActive() truely', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: true,
			} );

			const result = isActive( state );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate isInspecting() falsy', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isInspecting: false,
			} );

			const result = isInspecting( state );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate isInspecting() truely', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isInspecting: true,
			} );

			const result = isInspecting( state );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can get inspectorPosition left', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				inspectorPosition: 'left',
			} );

			const result = inspectorPosition( state );

			expect( result ).toStrictEqual( 'left' );
		} );

		test( 'can get inspectorPosition right', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				inspectorPosition: 'right',
			} );

			const result = inspectorPosition( state );

			expect( result ).toStrictEqual( 'right' );
		} );

		test( 'can indicate inDesktopRange() falsy', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 320,
			} );

			const result = inDesktopRange( state );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate inDesktopRange() truely', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1360,
			} );

			const result = inDesktopRange( state );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate inTabletRange() falsy', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 1280,
			} );

			const result = inTabletRange( state );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate inTabletRange() truely', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 820,
			} );

			const result = inTabletRange( state );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate inMobileRange() falsy', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 820,
			} );

			const result = inMobileRange( state );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate inMobileRange() truely', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 320,
			} );

			const result = inMobileRange( state );

			expect( result ).toStrictEqual( true );
		} );
	} );

	describe( 'styles', () => {
		test( 'can indicate hasBlockViewports() falsy on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {},
				changes: {},
				removes: {},
			} );

			const result = hasBlockViewports( state, 'client-id' );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate hasBlockViewports() falsy with only client-id set', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {
					'client-id' : {},
				},
				changes: {
					'client-id' : {}
				},
				removes: {
					'client-id' : {}
				},
			} );

			const result = hasBlockViewports( state, 'client-id' );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate hasBlockViewports() truely with saves', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				},
				changes: {},
				removes: {},
			} );

			const result = hasBlockViewports( state, 'client-id' );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate hasBlockViewports() truely with changes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				},
				removes: {},
			} );

			const result = hasBlockViewports( state, 'client-id' );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate hasBlockViewports() truely with removes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {},
				changes: {},
				removes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				},
			} );

			const result = hasBlockViewports( state, 'client-id' );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate hasBlockViewports() truely with all', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
									},
									margin: '20px',
								}
							}
						}
					}
				},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				},
				removes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									margin: '20px',
								}
							}
						}
					}
				},
			} );

			const result = hasBlockViewports( state, 'client-id' );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can getSaves() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {},
			} );

			const result = getSaves( state );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getSaves() with saves', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {
					'client-id-1': {
						1024: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					},
					'client-id-2': {
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						}
					}
				},
			} );

			const check = {
				'client-id-1': {
					1024: {
						style: {
							dimensions: {
								padding: '20px',
							}
						}
					}
				},
				'client-id-2': {
					768: {
						style: {
							dimensions: {
								margin: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					}
				}
			};
			const result = getSaves( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getBlockSaves() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {},
			} );

			const result = getBlockSaves( state, 'client-id' );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getBlockSaves() with saves', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {
					'client-id-1': {
						1024: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					},
					'client-id-2': {
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						}
					}
				},
			} );

			const check = {
				1024: {
					style: {
						dimensions: {
							padding: '20px',
						}
					}
				}
			};
			const result = getBlockSaves( state, 'client-id-1' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getGeneratedBlockSaves() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {},
				changes: {}
			} );

			const result = getGeneratedBlockSaves( state, 'client-id' );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getGeneratedBlockSaves() with saves', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1024: {
							style: {
								dimensions: {
									margin: {
										top: '40px',
										bottom: '40px',
									},
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						}
					}
				},
				changes: {}
			} );

			const check = {
				768: {
					style: {
						dimensions: {
							margin: {
								top: '20px',
								bottom: '20px',
							}
						}
					}
				},
				1024: {
					style: {
						dimensions: {
							margin: {
								top: '40px',
								bottom: '40px',
							},
							padding: {
								top: '20px',
								bottom: '20px',
							}
						}
					}
				}
			};
			const result = getGeneratedBlockSaves( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getGeneratedBlockSaves() with changes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1024: {
							style: {
								dimensions: {
									margin: {
										top: '40px',
										bottom: '40px',
									},
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						}
					}
				}
			} );

			const check = {
				768: {
					style: {
						dimensions: {
							margin: {
								top: '20px',
								bottom: '20px',
							}
						}
					}
				},
				1024: {
					style: {
						dimensions: {
							margin: {
								top: '40px',
								bottom: '40px',
							},
							padding: {
								top: '20px',
								bottom: '20px',
							}
						}
					}
				}
			};
			const result = getGeneratedBlockSaves( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getGeneratedBlockSaves() with saves and changes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				saves: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									margin: '0',
								}
							}
						},
						1024: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					},
				},
				changes: {
					'client-id': {
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1024: {
							style: {
								dimensions: {
									margin: {
										top: '40px',
										bottom: '40px',
									},
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						}
					}
				}
			} );

			const check = {
				768: {
					style: {
						dimensions: {
							margin: {
								top: '20px',
								bottom: '20px',
							}
						}
					}
				},
				1024: {
					style: {
						dimensions: {
							margin: {
								top: '40px',
								bottom: '40px',
							},
							padding: {
								top: '20px',
								bottom: '20px',
							}
						}
					}
				}
			};
			const result = getGeneratedBlockSaves( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getChanges() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				changes: {},
			} );

			const result = getChanges( state );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getChanges() with changes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				changes: {
					'client-id-1': {
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						}
					},
					'client-id-2': {
						1024: {
							style: {
								dimensions: {
									margin: '40px',
								}
							}
						}
					}
				}
			} );

			const check = {
				'client-id-1': {
					768: {
						style: {
							dimensions: {
								margin: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					}
				},
				'client-id-2': {
					1024: {
						style: {
							dimensions: {
								margin: '40px',
							}
						}
					}
				}
			};

			const result = getChanges( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getBlockChanges() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				changes: {},
			} );

			const result = getBlockChanges( state, 'client-id' );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getBlockChanges() with changes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				changes: {
					'client-id': {
						768: {
							style: {
								dimension: {
									padding: '20px',
								}
							}
						}
					}
				}
			} );

			const check = {
				768: {
					style: {
						dimension: {
							padding: '20px',
						}
					}
				}
			}

			const result = getBlockChanges( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getBlockDefaults() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				changes: {},
			} );

			const check = {
				style: {},
			}

			const result = getBlockDefaults( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getBlockDefaults() with defaults', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				defaults: {
					'client-id': {
						style: {
							dimension: {
								padding: '20px',
							}
						}
					}
				}
			} );

			const check = {
				style: {
					dimension: {
						padding: '20px',
					}
				}
			}

			const result = getBlockDefaults( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getValids() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				valids: {},
			} );

			const result = getValids( state );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getValids() with valids', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				valids: {
					'client-id-1': {
						375: {},
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1360: {
							style: {
								dimensions: {
									margin: '20px',
								}
							}
						}

					},
					'client-id-2': {
						375: {},
						768: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1360: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				}
			} );

			const check = {
				'client-id-1': {
					375: {},
					768: {
						style: {
							dimensions: {
								margin: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					},
					1360: {
						style: {
							dimensions: {
								margin: '20px',
							}
						}
					}

				},
				'client-id-2': {
					375: {},
					768: {
						style: {
							dimensions: {
								padding: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					},
					1360: {
						style: {
							dimensions: {
								padding: '20px',
							}
						}
					}
				}
			};

			const result = getValids( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getBlockValids() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				valids: {},
			} );

			const result = getBlockValids( state, 'client-id' );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getBlockValids() with valids', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				valids: {
					'client-id': {
						375: {},
						768: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1360: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				}
			} );

			const check = {
				375: {},
				768: {
					style: {
						dimensions: {
							padding: {
								top: '20px',
								bottom: '20px',
							}
						}
					}
				},
				1360: {
					style: {
						dimensions: {
							padding: '20px',
						}
					}
				}
			}

			const result = getBlockValids( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getViewportValids() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				valids: {},
			} );

			const result = getViewportValids( state );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getViewportValids() from default', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: false,
				isEditing: false,
				viewport: 768,
				valids: {
					'client-id-1': {
						0: {},
						375: {},
						1360: {}
					},
					'client-id-2': {
						0: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						},
						375: {},
						768: {
							style: {
								dimensions: {
									margin: '20px',
								}
							}
						},
						1360: {}
					},
				},
			} );

			const check = {
				'client-id-1': {},
				'client-id-2': {
					style: {
						dimensions: {
							padding: '20px',
						}
					}
				}
			}

			const result = getViewportValids( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getViewportValids() with wrong filled valids', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: true,
				isEditing: true,
				viewport: 768,
				valids: {
					'client-id-1': {
						375: {},
						1360: {}
					},
					'client-id-2': {
						375: {},
						768: {
							style: {
								dimensions: {
									margin: '20px',
								}
							}
						},
						1360: {}
					},
				},
			} );

			const check = {
				'client-id-2': {
					style: {
						dimensions: {
							margin: '20px',
						}
					}
				}
			}

			const result = getViewportValids( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getViewportValids() with right filled valids', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				isActive: true,
				isEditing: true,
				viewport: 768,
				valids: {
					'client-id-1': {
						375: {},
						768: {},
						1360: {}
					},
					'client-id-2': {
						375: {},
						768: {
							style: {
								dimensions: {
									margin: '20px',
								}
							}
						},
						1360: {}
					},
				},
			} );

			const check = {
				'client-id-1': {},
				'client-id-2': {
					style: {
						dimensions: {
							margin: '20px',
						}
					}
				}
			}

			const result = getViewportValids( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getViewportBlockValids() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				valids: {},
			} );

			const result = getViewportBlockValids( state, 'client-id' );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getViewportBlockValids() with valids and invalid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 820,
				valids: {
					'client-id': {
						375: {},
						768: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1360: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				}
			} );

			const result = getViewportBlockValids( state, 'client-id' );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getViewportBlockValids() with valids and valid viewport', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				viewport: 768,
				valids: {
					'client-id': {
						375: {},
						768: {
							style: {
								dimensions: {
									padding: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						},
						1360: {
							style: {
								dimensions: {
									padding: '20px',
								}
							}
						}
					}
				}
			} );

			const check = {
				style: {
					dimensions: {
						padding: {
							top: '20px',
							bottom: '20px',
						}
					}
				}
			}

			const result = getViewportBlockValids( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getRemoves() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				removes: {},
			} );

			const result = getRemoves( state );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getRemoves() with removes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				removes: {
					'client-id-1': {
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						}
					},
					'client-id-2': {
						1360: {
							style: {
								dimensions: {
									padding: '40px',
								}
							}
						}
					}
				}
			} );

			const check = {
				'client-id-1': {
					768: {
						style: {
							dimensions: {
								margin: {
									top: '20px',
									bottom: '20px',
								}
							}
						}
					}
				},
				'client-id-2': {
					1360: {
						style: {
							dimensions: {
								padding: '40px',
							}
						}
					}
				}
			}

			const result = getRemoves( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getBlockRemoves() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				removes: {},
			} );

			const result = getBlockRemoves( state, 'client-id' );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getBlockRemoves() with removes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				removes: {
					'client-id': {
						320: {
							style: {
								dimensions: {
									padding: '0',
								}
							}
						},
						768: {
							style: {
								dimensions: {
									margin: {
										top: '20px',
										bottom: '20px',
									}
								}
							}
						}
					}
				},
			} );

			const check = {
				320: {
					style: {
						dimensions: {
							padding: '0',
						}
					}
				},
				768: {
					style: {
						dimensions: {
							margin: {
								top: '20px',
								bottom: '20px',
							}
						}
					}
				}
			}

			const result = getBlockRemoves( state, 'client-id' );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can getLastEdit() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				lastEdit: 0,
			} );

			const result = getLastEdit( state );

			expect( result ).toStrictEqual( 0 );
		} );

		test( 'can getLastEdit() with last edit timestamp', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				lastEdit: 1693932000,
			} );

			const result = getLastEdit( state );

			expect( result ).toStrictEqual( 1693932000 );
		} );

		test( 'can getRendererSet() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {},
			} );

			const result = getRendererSet( state, 'key' );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can getRendererSet() with renderers and invalid key', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					key: () => {},
				},
			} );

			const result = getRendererSet( state, 'padding' );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can getRendererSet() with renderers and valid key', () => {
			const callback = () => {};

			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					key: callback,
				},
			} );

			const result = getRendererSet( state, 'key' );

			expect( result ).toStrictEqual( callback );
		} );

		test( 'can getRendererPropertySet() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {},
			} );

			const result = getRendererPropertySet( state );

			expect( result ).toStrictEqual( {} );
		} );

		test( 'can getRendererPropertySet() with renderers', () => {
			const callback1 = () => {};
			const callback2 = () => {};

			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					key1: {
						callback: callback1,
						selectorPanel: '.panel',
					},
					key2: {
						callback: callback2,
						selectorPanel: '.panel',
					},
				},
			} );

			const check = {
				key1: {
					callback: callback1,
					selectorPanel: '.panel',
				},
				key2: {
					callback: callback2,
					selectorPanel: '.panel',
				},
			}

			const result = getRendererPropertySet( state );

			expect( result ).toStrictEqual( check );
		} );

		test( 'can indicate needsRenderer() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {},
			} );

			const result = needsRenderer( state, {} );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate needsRenderer() with invalid attributes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					key: () => {},
				},
			} );

			const style = {
				padding: '10px',
			}

			const result = needsRenderer( state, style );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate needsRenderer() with valid attributes', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					key: () => {},
				},
			} );

			const style = {
				key: '10px',
			}

			const result = needsRenderer( state, style );

			expect( result ).toStrictEqual( true );
		} );

		test( 'can indicate hasRenderer() on emptyness', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {},
			} );

			const result = hasRenderer( state, 'key' );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate hasRenderer() with invalid key', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					key: () => {},
				},
			} );

			const result = hasRenderer( state, 'padding' );

			expect( result ).toStrictEqual( false );
		} );

		test( 'can indicate hasRenderer() with valid renderer', () => {
			const state = deepFreeze( {
				... DEFAULT_STATE,
				renderer: {
					key: () => {},
				},
			} );

			const result = hasRenderer( state, 'key' );

			expect( result ).toStrictEqual( true );
		} );
	} );
} );