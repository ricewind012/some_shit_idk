const strAssetURL = "https://shared.steamstatic.com/community_assets/images/apps";

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

customElements.define( "steam-friend-item", class extends HTMLElement
{
	connectedCallback()
	{
		const { avatarHash, description, name } = this.dataset;

		const src = `https://avatars.fastly.steamstatic.com/${avatarHash}.jpg`;
		this.appendChild( CreateElement( "page-item-info", {
			"data-description": description,
			"data-image-size": "sm",
			"data-name": name,
			"data-src": src,
		}, "" ) );
	}
} );

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
			"Mirage Feathers",
			"2719060/e9d2405835b5b965bba923de4fd0334feb77859e.jpg",
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
			const src = `${strAssetURL}/${srcPart}`;
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

customElements.define( "steam-appdetails-achievements", class extends HTMLElement
{
	m_schemes = {
		dark: `
			<div class="appdetailssection_Highlight">
				<div class="appdetailsachievementssection_UnlockedLabel">
					You've unlocked 27/47
					<div>(57%)</div>
				</div>
				<progress max="100" value="57"></progress>
			</div>
			<page-item-info
				data-description="One need not travel alone"
				data-image-size="md"
				data-name="The Friend"
				data-src="${strAssetURL}/312520/df7c6a263aa1e213fe493e127d645d043e9191c9.jpg"
			></page-item-info>
			<div class="appdetailsachievementssection_Additional">
				<img src="${strAssetURL}/312520/944f3f2180c9a75a563b5a7c4526355381caf7ab.jpg" />
				<img src="${strAssetURL}/312520/d5b28c8d4281ce7f49ebbe62fcb2b2498317af9d.jpg" />
				<img src="${strAssetURL}/312520/3cc069e14eb93ce51aac0ce1694f717da756bd68.jpg" />
				<img src="${strAssetURL}/312520/45efdbd411184e3bf3414f3eeac13aad1f9dbb3f.jpg" />
				<page-button data-where="content">+23</page-button>
			</div>
			<div class="appdetailsachievementssection_Label">
				Locked achievements
			</div>
			<div class="appdetailsachievementssection_Additional">
				<img src="${strAssetURL}/312520/934f5ae48886196db3f01e212b3341dc1bdb1276.jpg" />
				<page-button data-where="content">+19</page-button>
			</div>
		`,
		light: `
			<div class="appdetailssection_Highlight">
				<div class="appdetailsachievementssection_UnlockedLabel">
					You've unlocked 4/13
					<div>(30%)</div>
				</div>
				<progress max="100" value="30"></progress>
			</div>
			<page-item-info
				data-description="Inserted a coin to continue"
				data-image-size="md"
				data-name="You're Rich!"
				data-src="${strAssetURL}/2719060/e5d1c1800ef11d0712ba26fe328f308b2f2d796e.jpg"
			></page-item-info>
			<div class="appdetailsachievementssection_Additional">
				<img src="${strAssetURL}/2719060/ca6e7126a7f53bcb48b7e42ae940914bcc597b1a.jpg" />
				<img src="${strAssetURL}/2719060/a6e75ce4deeda97f529538434dd97d804beee155.jpg" />
				<img src="${strAssetURL}/2719060/556e13c1dd8aa43731d2c79662957d4e18a8b2e3.jpg" />
				<img src="${strAssetURL}/2719060/6a6c024e58347ba4c8565e4a8b89afdaa205ceb8.jpg" />
			</div>
			<div class="appdetailsachievementssection_Label">
				Locked achievements
			</div>
			<div class="appdetailsachievementssection_Additional">
				<img src="${strAssetURL}/2719060/9abb3761358262f1d193c1e845b1a4a1cf76ea7d.jpg" />
				<page-button data-where="content">+5</page-button>
			</div>
		`,
	};

	connectedCallback()
	{
		const scheme = [...this.classList].find( (e) => e === "dark" || e === "light" );
		this.innerHTML = this.m_schemes[ scheme ];
		console.log(this.m_schemes[scheme])
	}
} );
