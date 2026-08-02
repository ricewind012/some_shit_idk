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
		strDescription: "A harsh contrast with the left side being focused on a specific accent color. Calculated by lightness.",
		strHeader: "Colors",
	},
	spacing: {
		strDescription: "maybe base it on text size XD",
		strHeader: "Spacing",
	},
	typography: {
		strDescription: "dogshit olol",
		strHeader: "Typography",
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
function SrgbToHex(srgb)
{
	const match = srgb.match( /^color\(srgb\s+(.+?)\s+(.+?)\s+(.+?)\)$/ );
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
		console.assert( name, "<color-gradient> element without a name present: %o", this );

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

			elContainer.addEventListener( "transitionstart",  ( ev ) =>
			{
				if ( ev.propertyName === "background-color" )
				{
					const val = this.GetHexColor(
						getComputedStyle( elContainer ).background,
					);
					elValue.textContent = val;
				}
			} );
		}
	}
} );

customElements.define( "hsl-slider", class extends HTMLElement
{
	m_labels =
	{
		h: "Hue",
		s: "Saturation",
		l: "Lightness",
	};

	connectedCallback()
	{
		const { max, min, name, step } = this.dataset;
		const bIsValidName = name === "h" || name === "s" || name === "l";
		console.assert( bIsValidName, "<hsl-slider> element with a wrong name: %o", this );

		const elInput = CreateElement( "input", { type: "range", min, max, step }, "" );
		elInput.addEventListener( "input", ( ev ) => 
		{
			const doc = document.documentElement;
			const value = name === "h" ? elInput.value : `${ elInput.value }%`;
			doc.style.setProperty( `--base-${ name }`, value );
		} );

		this.appendChild(
			CreateElement( "label", {}, [
				CreateElement( "h3", {}, this.m_labels[ name ] ),
				elInput,
			] ),
		);
	}
} );

customElements.define( "page-section", class extends HTMLElement
{
	connectedCallback()
	{
		console.assert( this.id, "<page-section> element without an id present: %o", this );

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
});
