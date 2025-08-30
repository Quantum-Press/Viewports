// Importiere lodash und weise es dem globalen window-Objekt zu
import _ from 'lodash';
import * as React from 'react';


// Globale Zuweisung von lodash zu window
( global as any ).window = global;
( global as any ).window.lodash = _;
( global as any ).window.React = typeof React;
