import {
    Attribute,
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef, Input, OnChanges, OnInit,
    ViewEncapsulation
} from '@angular/core';

import { mixinColor, CanColor } from '@ptsecurity/mosaic/core';

import { McIconRegistry } from './icon-registry';


@Directive({
    selector: '[mc-icon]',
    host: { class: 'mc-icon mc' }
})
export class McIconCSSStyler {}


export class McIconBase {
    constructor(public _elementRef: ElementRef) {}
}

export const _McIconMixinBase = mixinColor(McIconBase);


@Component({
    selector: 'mc-icon',
    exportAs: 'mcIcon',
    template: '<ng-content></ng-content>',
    styleUrls: ['./icon.css'],
    inputs: ['color'],
    host: {
        'role': 'img',
        'class': 'mc-icon',
        '[class.mc-icon-inline]': 'inline'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class McIcon extends _McIconMixinBase implements OnChanges, OnInit, CanColor {

    /** Name of the icon in the SVG icon set. */
    @Input() svgIcon: string;

    @Input()
    get fontSet(): string { return this._fontSet; }
    set fontSet(value: string) {
        this._fontSet = this._cleanupFontValue(value);
    }

    @Input()
    get fontIcon(): string { return this._fontIcon; }
    set fontIcon(value: string) {
        this._fontIcon = this._cleanupFontValue(value);
    }

    private _fontSet: string;
    private _fontIcon: string;
    private _previousFontSetClass: string;
    private _previousFontIconClass: string;

    constructor(elementRef: ElementRef,
                private _iconRegistry: McIconRegistry,
                @Attribute('aria-hidden') ariaHidden: string) {
        super(elementRef);

        if (!ariaHidden) {
            elementRef.nativeElement.setAttribute('aria-hidden', 'true');
        }
    }

    ngOnInit() {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <mc-icon>arrow</mc-icon> In this case we need to add a CSS class for the default font.
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    }

    ngOnChanges() {

        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    }

    private _usingFontIcon(): boolean {
        return !this.svgIcon;
    }

    private _updateFontIconClasses() {
        if (!this._usingFontIcon()) {
            return;
        }

        const elem: HTMLElement = this._elementRef.nativeElement;
        const fontSetClass = this.fontSet ?
            this._iconRegistry.classNameForFontAlias(this.fontSet) :
            this._iconRegistry.getDefaultFontSetClass();

        if (fontSetClass !== this._previousFontSetClass) {
            if (this._previousFontSetClass) {
                elem.classList.remove(this._previousFontSetClass);
            }
            if (fontSetClass) {
                elem.classList.add(fontSetClass);
            }
            this._previousFontSetClass = fontSetClass;
        }

        if (this.fontIcon !== this._previousFontIconClass) {
            if (this._previousFontIconClass) {
                elem.classList.remove(this._previousFontIconClass);
            }
            if (this.fontIcon) {
                elem.classList.add(this.fontIcon);
            }
            this._previousFontIconClass = this.fontIcon;
        }
    }

    /**
     * Cleans up a value to be used as a fontIcon or fontSet.
     * Since the value ends up being assigned as a CSS class, we
     * have to trim the value and omit space-separated values.
     */
    private _cleanupFontValue(value: string) {
        return typeof value === 'string' ? value.trim().split(' ')[0] : value;
    }
}
