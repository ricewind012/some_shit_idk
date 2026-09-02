// 

/**
 * Take a guess
 * @param {keyof HTMLElementTagNameMap} strTag
 * @param {Record< string, string > & { [ev: `on${ keyof HTMLElementEventMap }`]: ( ev: Event ) => void }} attrs
 * @param {string | HTMLElement[]} child
 * @returns {HTMLElement}
 */
function CreateElement( strTag, attrs, child )
{
	const el = document.createElement( strTag );
	for ( const [ k, v ] of Object.entries( attrs ).filter( (e) => !e[0].startsWith( "on" ) ) )
	{
		el.setAttribute( k, v );
	}

	for ( const [ k, v ] of Object.entries( attrs ).filter( (e) => e[0].startsWith( "on" ) ) )
	{
		el.addEventListener( k.slice( 2 ), v );
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

customElements.define( "steam-sidebar-game-list", class extends HTMLElement
{
	m_items =
	[
		[
			"Counter-Strike 2",
			"730/8dbc71957312bbd3baea65848b545be9eae2a355.jpg",
		],
		[
			"Garry's Mod",
			"4000/4a6f25cfa2426445d0d9d6e233408de4d371ce8b.jpg",
		],
		[
			"Harmonia",
			"421660/9eb25bcccd7b192eeb1ab806532f61e0f49198ff.jpg",
		],
		[
			"Milk inside a bag of milk inside a bag of milk",
			"1392820/c2a9062c3a24a042d6d94ccd96cca33f2bd67fe8.jpg",
		],
		[
			"Mirror's Edge",
			"17410/cfea4731163004b2e5117c3b42a798c48c483d8f.jpg",
		],
		[
			"Little Witch Nobeta",
			"1049890/8076664ce9107d165fde619b194d31ae50b9e102.jpg",
		],
		[
			"Rain World",
			"312520/5854494b840a18a660a495d6259d562b51f21240.jpg",
		],
		[
			"The Citadel",
			"1378290/06614d273068a32473835f6acdb327fdaa621e37.jpg",
		],
		[
			"War Thunder",
			"236390/c69fbafb6e9891314cc5df0fe6a659612c289bf9.jpg",
		],
		[
			"Z.A.T.O. // I Love the World and Everything In It",
			"4122860/279871be81ffe844e0ac24a1afea74af33126822.jpg",
		],
		[
			"Zenless Zone Zero",
			"4162040/23dbf9d8037561c6508d5307c57c9ffb78e66fca.jpg",
		],
	];

	connectedCallback()
	{
		const list = CreateElement( "page-list", {}, this.m_items.map( ( [ name, srcPart ], i ) =>
		{
			const src = `https://shared.fastly.steamstatic.com/community_assets/images/apps/${srcPart}`;
			return CreateElement( "page-list-item", i === 4 && { "data-selected": "" }, [
				CreateElement( "img", { src }, "", ),
				CreateElement( "div", {}, name ),
			], );
		}, ), );
		this.appendChild( list );
	}
} );

customElements.define( "steam-store-discount", class extends HTMLElement
{
	connectedCallback()
	{
		this.appendChild(
			CreateElement( "steam-store-discount-pct", {}, "+50%" ),
		);
		this.appendChild(
			CreateElement( "steam-store-discount-prices", {}, [
				CreateElement( "steam-store-discount-original-price", {}, "69,99€" ),
				CreateElement( "steam-store-discount-new-price", {}, "104,99€" ),
			] ),
		);
	}
} );
