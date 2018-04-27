/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import Event from 'vs/base/common/event';
import * as WinJS from 'vs/base/common/winjs.base';
import * as Mouse from 'vs/base/browser/mouseEvent';
import * as Touch from 'vs/base/browser/touch';
import * as Keyboard from 'vs/base/browser/keyboardEvent';
import { Color } from 'vs/base/common/color';

export interface ITable {
	onDidFocus: Event<void>;
	onDidBlur: Event<void>;
	onDidChangeFocus: Event<IFocusEvent>;
	onDidChangeSelection: Event<ISelectionEvent>;
	onDidChangeHighlight: Event<IHighlightEvent>;
	onDidDispose: Event<void>;
}

// Events
export interface ISelectionEvent {
	selection: any[];
	payload?: any;
}

export interface IRowRange {
	startRow: number;
	endRow: number;
}

export interface ITableInput {
	columns: string[];
	numberOfRows: number;
}

export interface IFocusEvent {
	focus: any;
	payload?: any;
}

export interface IHighlightEvent {
	highlight: any;
	payload?: any;
}

export interface IRenderer {

	/**
	 * Returns the element's height in the tree, in pixels.
	 */
	getHeight(tree: ITable, element: any): number;

	/**
	 * Returns the element's width in the tree, in pixels.
	 */
	getWidth(tree: ITable, element: any): number;

	/**
	 * Returns a template ID for a given element. This will be used as an identifier
	 * for the next 3 methods.
	 */
	getTemplateId(tree: ITable, element: any): string;

	/**
	 * Renders the template in a DOM element. This method should render all the DOM
	 * structure for an hypothetical element leaving its contents blank. It should
	 * return an object bag which will be passed along to `renderElement` and used
	 * to fill in those blanks.
	 *
	 * You should do all DOM creating and object allocation in this method. It
	 * will be called only a few times.
	 */
	renderTemplate(tree: ITable, templateId: string, container: HTMLElement): any;

	/**
	 * Renders an element, given an object bag returned by `renderTemplate`.
	 * This method should do as little as possible and ideally it should only fill
	 * in the blanks left by `renderTemplate`.
	 *
	 * Try to make this method do as little possible, since it will be called very
	 * often.
	 */
	renderElement(tree: ITable, element: any, templateId: string, templateData: any): void;

	/**
	 * Disposes a template that was once rendered.
	 */
	disposeTemplate(tree: ITable, templateId: string, templateData: any): void;
}

export interface IDataSource {

	/**
	 * Returns the unique identifier of the given element.
	 * No more than one element may use a given identifier.
	 */
	getId(tree: ITable, element: any): string;

	/**
	 * Returns a boolean value indicating whether the element has children.
	 */
	hasChildren(tree: ITable, element: any): boolean;

	/**
	 * Returns the element's children as an array in a promise.
	 */
	getChildren(tree: ITable, element: any): WinJS.Promise;

	/**
	 * Returns the element's parent in a promise.
	 */
	getParent(tree: ITable, element: any): WinJS.Promise;

	/**
	 * Returns whether an element should be expanded when first added to the tree.
	 */
	shouldAutoexpand?(tree: ITable, element: any): boolean;
}

export interface IController {

	/**
	 * Called when an element is clicked.
	 */
	onClick(tree: ITable, element: any, event: Mouse.IMouseEvent): boolean;

	/**
	 * Called when an element is requested for a context menu.
	 */
	onContextMenu(tree: ITable, element: any, event: ContextMenuEvent): boolean;

	/**
	 * Called when an element is tapped.
	 */
	onTap(tree: ITable, element: any, event: Touch.GestureEvent): boolean;

	/**
	 * Called when a key is pressed down while selecting elements.
	 */
	onKeyDown(tree: ITable, event: Keyboard.IKeyboardEvent): boolean;

	/**
	 * Called when a key is released while selecting elements.
	 */
	onKeyUp(tree: ITable, event: Keyboard.IKeyboardEvent): boolean;

	/**
	 * Called when a mouse button is pressed down on an element.
	 */
	onMouseDown?(tree: ITable, element: any, event: Mouse.IMouseEvent): boolean;

	/**
	 * Called when a mouse button goes up on an element.
	 */
	onMouseUp?(tree: ITable, element: any, event: Mouse.IMouseEvent): boolean;
}

export /* abstract */ class ContextMenuEvent {

	private _posx: number;
	private _posy: number;
	private _target: HTMLElement;

	constructor(posx: number, posy: number, target: HTMLElement) {
		this._posx = posx;
		this._posy = posy;
		this._target = target;
	}

	public preventDefault(): void {
		// no-op
	}

	public stopPropagation(): void {
		// no-op
	}

	public get posx(): number {
		return this._posx;
	}

	public get posy(): number {
		return this._posy;
	}

	public get target(): HTMLElement {
		return this._target;
	}
}

export class MouseContextMenuEvent extends ContextMenuEvent {

	private originalEvent: Mouse.IMouseEvent;

	constructor(originalEvent: Mouse.IMouseEvent) {
		super(originalEvent.posx, originalEvent.posy, originalEvent.target);
		this.originalEvent = originalEvent;
	}

	public preventDefault(): void {
		this.originalEvent.preventDefault();
	}

	public stopPropagation(): void {
		this.originalEvent.stopPropagation();
	}
}

export class KeyboardContextMenuEvent extends ContextMenuEvent {

	private originalEvent: Keyboard.IKeyboardEvent;

	constructor(posx: number, posy: number, originalEvent: Keyboard.IKeyboardEvent) {
		super(posx, posy, originalEvent.target);
		this.originalEvent = originalEvent;
	}

	public preventDefault(): void {
		this.originalEvent.preventDefault();
	}

	public stopPropagation(): void {
		this.originalEvent.stopPropagation();
	}
}

export interface ITableConfiguration {
	dataSource: IDataSource;
	renderer?: IRenderer;
	controller?: IController;
	// dnd?: IDragAndDrop;
	// filter?: IFilter;
	// sorter?: ISorter;
	// accessibilityProvider?: IAccessibilityProvider;
}

export interface ITableOptions extends ITableStyles {
	// alwaysFocused?: boolean;
	useShadows?: boolean;
	ariaLabel?: string;
	keyboardSupport?: boolean;
}

export interface ITableStyles {
	listFocusBackground?: Color;
	listFocusForeground?: Color;
	listActiveSelectionBackground?: Color;
	listActiveSelectionForeground?: Color;
	listFocusAndSelectionBackground?: Color;
	listFocusAndSelectionForeground?: Color;
	listInactiveSelectionBackground?: Color;
	listInactiveSelectionForeground?: Color;
	listHoverBackground?: Color;
	listHoverForeground?: Color;
	listDropBackground?: Color;
	listFocusOutline?: Color;
}

export interface ITableContext extends ITableConfiguration {
	table: ITable;
	options: ITableOptions;
}
