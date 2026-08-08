/** @type {Record< string, string >} */
const k_mapFonts =
{
	"heading-large": "Heading (large)",
	"heading-medium": "Heading (medium)",
	"heading-small": "Heading (small)",
	"body-large": "Body (large)",
	"body-medium": "Body (medium)",
	"body-small": "Body (small)",
};

/** @type {Record< string, { strDescription: string; strHeader: string } >} */
const k_mapText =
{
	intro: {
		strDescription: "No Storybook, Figma and others, only raw CSS, as it's made primarily for theming web applications, easily copypastable.",
		strHeader: "hello",
	},
	absent: {
		strDescription: "desc",
		strHeader: "Absent shit",
	},
	colors: {
		strDescription: "A (by default) harsh contrast with the left side being focused on a specific accent color. Freely configurable saturation and lightness.",
		strHeader: "Colors",
	},
	spacing: {
		strDescription: "based on text size XD",
		strHeader: "Spacing",
	},
	typography: {
		strDescription: "STOOOOOOOLEN",
		strHeader: "Typography",
	},

	"components-button": {
		strDescription: "yep",
		strHeader: "Components - Button",
	},
	"components-dialog": {
		strDescription: "yes",
		strHeader: "Components - Dialog",
	},
	"components-menu": {
		strDescription: "It's usually in the content, so should not have content colors... right ?",
		strHeader: "Components - Menu",
	},
	"components-slider": {
		strDescription: "yes",
		strHeader: "Components - Slider",
	},
};

/**
 * Take a guess
 * @param {keyof HTMLElementTagNameMap} strTag
 * @param {Record< string, string >} attrs
 * @param {string | HTMLElement[]} child
 * @returns {HTMLElement}
 */
function CreateElement( strTag, attrs, child )
{
	const el = document.createElement( strTag );
	for ( const [ k, v ] of Object.entries( attrs ) )
	{
		el.setAttribute( k, v );
	}

	if ( Array.isArray( child ) )
	{
		for ( const c of child )
		{
			el.appendChild( c );
		}
	}
	else
	{
		el.setHTML( child );
	}

	return el;
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
function RgbToHex( r, g, b )
{
	const rgb = [ r, g, b ]
		.map( ( e ) => e.toString( 16 ).padStart( 2, "0" ) )
		.join( "" );
	return `#${ rgb }`;
}

/**
 * @param {string} srgb
 */
function SrgbToHex( srgb )
{
	const match = srgb.match( /^color\(srgb\s+(.+?)\s+(.+?)\s+(.+?)\)/ );
	const r = Math.round( Number.parseFloat( match[1] ) * 255 );
	const g = Math.round( Number.parseFloat( match[2] ) * 255 );
	const b = Math.round( Number.parseFloat( match[3] ) * 255 );
	return RgbToHex( r, g, b );
}

customElements.define( "color-gradient", class extends HTMLElement
{
	GetHexColor( value )
	{
		const rgb = value
			.match( /^rgb\((\d+),\s+(\d+),\s+(\d+)\)$/ )
			?.slice( 1 )
			.map( Number );
		return value.startsWith( "color" ) ? SrgbToHex( value ) : RgbToHex( ...rgb );
	}

	connectedCallback()
	{
		const { name } = this.dataset;

		const colors = [ "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
		for ( const color of colors )
		{
			const strVarName = `--${ name }-${ color }`;
			const elContainer = CreateElement(
				"color-gradient-container",
				{ style: `--bg: var(${ strVarName })` },
				"",
			);
			this.appendChild( elContainer );
			elContainer.appendChild( CreateElement( "color-gradient-var", {}, strVarName ) );

			const val = this.GetHexColor( getComputedStyle( elContainer ).background );
			const elValue = CreateElement( "color-gradient-value", {}, val );
			elContainer.appendChild( elValue );

			elContainer.addEventListener( "transitionstart",	( ev ) =>
			{
				if ( ev.propertyName !== "background-color" )
				{
					return;
				}

				const val = this.GetHexColor( getComputedStyle( elContainer ).background );
				elValue.textContent = val;
			} );
		}
	}
} );

customElements.define( "color-slider", class extends HTMLElement
{
	m_labels =
	{
		"accent-h": "Accent hue",
		"base-s": "Saturation",
		"base-l": "Lightness",
		"l-step": "Lightness step",
	};

	connectedCallback()
	{
		const { max, min, name, step } = this.dataset;
		const doc = document.documentElement;
		const prop = `--${ name }`;

		const elInput = CreateElement( "input", { type: "range", min, max, step }, "" );
		elInput.value = getComputedStyle( doc ).getPropertyValue( prop ).replace( "%", "" );
		elInput.addEventListener( "input", ( ev ) => 
		{
			const value = name.startsWith( "base" ) ? `${ elInput.value }%` : elInput.value;
			doc.style.setProperty( prop, value );
		} );

		this.appendChild(
			CreateElement( "label", {}, [
				CreateElement( "h3", {}, this.m_labels[ name ] ),
				elInput,
			] ),
		);
	}
} );

customElements.define( "menu-stuff", class extends HTMLElement
{
	connectedCallback()
	{
		// Stolen from GitHub's kebab menu in code view
		this.innerHTML = `
			<page-menu>
				<page-menu-heading>
					Raw file content
				</page-menu-heading>
				<page-menu-item data-icon="download">
					Download
				</page-menu-item>
				<page-menu-separator></page-menu-separator>
				<page-menu-item data-icon="code">
					Jump to line
				</page-menu-item>
				<page-menu-separator></page-menu-separator>
				<page-menu-item data-icon="conversion_path">
					Copy path
				</page-menu-item>
				<page-menu-item data-icon="link">
					Copy permalink
				</page-menu-item>
				<page-menu-separator></page-menu-separator>
				<page-menu-heading>
					View options
				</page-menu-heading>
				<page-menu-item data-icon="unfold_less">
					Show code folding buttons
				</page-menu-item>
				<page-menu-item data-icon="wrap_text">
					Wrap lines
				</page-menu-item>
				<page-menu-item data-icon="align_center">
					Center content
				</page-menu-item>
				<page-menu-item data-icon="left_click">
					Open symbols on click
				</page-menu-item>
				<page-menu-separator></page-menu-separator>
				<page-menu-item data-icon="delete">
					Delete file
				</page-menu-item>
			</page-menu>
		`;
	}
} );

customElements.define( "page-section", class extends HTMLElement
{
	connectedCallback()
	{
		const { strDescription, strHeader } = k_mapText[ this.id ];
		const elDescription = CreateElement( "h2", { "data-bg-clip": "" }, strHeader );
		this.appendChild( elDescription );
		const elHeader = CreateElement( "p", { "data-bg-clip": "" }, strDescription );
		this.appendChild( elHeader );
	}
} );

customElements.define( "typography-info", class extends HTMLElement
{
	connectedCallback()
	{
		this.dataset.twoColumnsSection = true;

		const { name } = this.dataset;
		if ( !name )
		{
			return;
		}

		const style = getComputedStyle( document.documentElement );
		// yes really
		const [ , fontSize, fontWeight ] = style
			.getPropertyValue( `--text--${ name }` )
			.match(/^\w+\s+(\d+)\s+(\d+px)/);
		this.appendChild(
			CreateElement( "typography-info-container", {}, [
				CreateElement( "typography-info-title", {}, k_mapFonts[ name ] ),
				CreateElement( "typography-info-subtitle", {}, `${ fontWeight } / ${ fontSize }` ),
			] ),
		);

		const strVarName = `--text--${ name }`;
		const elVarName = CreateElement( "typography-info-var", {}, strVarName );
		elVarName.style.font = `var(${ strVarName })`;
		this.appendChild( elVarName );
	}
} );

document.addEventListener( "DOMContentLoaded", () =>
{
	/** @param {string} id */
	const id = ( id ) => document.getElementById( id );
	const els =
	{
		cDialog_Dialog: id( "dialog" ),
		cDialog_DialogBackdrop: id( "dialog-backdrop" ),
		cDialog_OK: id( "components-dialog--ok-button" ),
		cDialog_OpenDialog: id( "components-dialog--open-dialog-button" ),
		cMenu_Menu: id( "components-menu--menu" ),
		cMenu_ToggleMenu: id( "components-menu--toggle-menu-button" ),
	};

	//
	// Radios
	//

	const k_RadioCallbacks =
	{
		"radio--dialog-size": ( arg ) =>
		{
			els.cDialog_Dialog.dataset.size = arg;
		},
		"radio--dialog-variant": ( arg ) =>
		{
			els.cDialog_Dialog.dataset.variant = arg;
		},
	};

	for ( const container of document.querySelectorAll( "page-radio-container" ) )
	{
		const { name } = container.dataset;
		for ( const radio of container.children )
		{
			radio.addEventListener( "click", () =>
			{
				for ( const radio of container.children )
				{
					delete radio.dataset.checked;
				}
				radio.dataset.checked = "";

				const { arg } = radio.dataset;
				k_RadioCallbacks[ name ]( arg );
			} );
		}
	}

	//
	// Dialog
	//

	els.cDialog_OpenDialog.addEventListener( "click", () =>
	{
		els.cDialog_DialogBackdrop.hidden = false;
	} );

	els.cDialog_OK.addEventListener( "click", () =>
	{
		els.cDialog_DialogBackdrop.hidden = true;
	} );

	//
	// Menu
	//

	els.cMenu_ToggleMenu.addEventListener( "click", () =>
	{
		els.cMenu_Menu.hidden = !els.cMenu_Menu.hidden;
	} );
});
