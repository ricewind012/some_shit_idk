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
	colors: {
		strDescription: "A harsh contrast with the left side being focused on a specific accent color",
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
 * @param {[ string,string ][]} attrs
 * @param {string | HTMLElement[]} child
 */
function CreateElement( strTag, attrs, child )
{
	const el = document.createElement( strTag );
	for ( const [ k, v ] of attrs )
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

customElements.define( "page-section", class extends HTMLElement
{
	connectedCallback()
	{
		console.assert( this.id, "<page-section> element without an id present: %o", this );

		const { strDescription, strHeader } = k_mapText[ this.id ];
		const elDescription = CreateElement( "h2", [ [ "data-bg-clip", "", ] ], strHeader );
		this.appendChild( elDescription );
		const elHeader = CreateElement( "p", [ [ "data-bg-clip", "", ] ], strDescription );
		this.appendChild( elHeader );
	}
} );

customElements.define( "typography-info", class extends HTMLElement
{
	connectedCallback()
	{
		const { name } = this.dataset;
		console.assert( name, "<typography-info> element without a name present: %o", this );

		const elName = CreateElement( "typography-info-name", [], k_mapFonts[ name ] );

		const style = getComputedStyle( document.documentElement );
		// yes really
		const [ , fontSize, fontWeight ] = style
			.getPropertyValue( `--text--${ name }` )
			.match(/^\w+\s+(\d+)\s+(\d+px)/);
		const elUnits = CreateElement( "typography-info-units", [], `${ fontWeight } / ${ fontSize }` );

		const elContainer = CreateElement( "typography-info-container", [], [  elName , elUnits ] );
		this.appendChild( elContainer );

		const strVarName = `--text--${ name }`;
		const elVarName = CreateElement( "typography-info-var", [], strVarName );
		elVarName.style.font = `var(${ strVarName })`;
		this.appendChild( elVarName );
	}
} );

document.addEventListener( "DOMContentLoaded", () =>
{
});
