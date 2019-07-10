// add leading zero
function leadingZero(value)
{
   if( value < 10 )
   {
      return "0" + value.toString();
   }
   return value.toString();    
}

// Initializations
$( document ).ready( function()
{					
	// show all tabs
	$( "#content > div" ).addClass( "active" );				
	
	// reset show count for processing
	$( "#progressDiv" ).data( "showCount", 1 );
	
	// store number of rows, columns and width for catalog menus
	$( "#productCatalog" ).data( "numberOfRows", 3 );
	$( "#productCatalog" ).data( "numberOfColumns", 3 )
	$( "#productCatalog" ).data( "columnWidth", 130 );
	$( "#creationCatalog" ).data( "numberOfRows", 2 );
	$( "#creationCatalog" ).data( "numberOfColumns", 2 )
	$( "#creationCatalog" ).data( "columnWidth", 130 );	
	
	// hide information view
	hideCanvasQuickInformation( "#dressingRoomCanvasQuickInformation" );
			
	// update catalog menus on resize
	$( window ).resize( function() 
	{ 
		updateCatalogMenuSize( $( "#dressingRoom" ), 
							   $( "#productCatalog" ), 
							   function()
							   {
								   updateCatalogMenu( $( "#productCatalog" ),
								   					  getClothes( $( "#productList li.active" ).attr( 'category' ) ),
													  createProductItem,
													  updateProductCatalogStatus ); 
							   } );
	
		updateCatalogMenuSize( $( "#creations" ),
						   	   $( "#creationCatalog" ), 
							   updateCreationsList );
	} );		
	
	// initialize jquery alerts
	$.alerts.draggable = false;
	$.alerts.overlayOpacity = 0.75;
						
	// prepare canvas objects
	prepareCanvas();
	
	// add event listeners for dressing room canvas
	dressingRoomCanvas.observe( 'cloth:hover', function( e ) { showCanvasQuickInformationSimple( e.memo.cursorInfo, e.memo.clothId, e.memo.canvas, "#dressingRoomCanvasQuickInformation" ); } );
	dressingRoomCanvas.observe( 'cloth:hover:end', function( e ) { hideCanvasQuickInformation( "#dressingRoomCanvasQuickInformation" ); } );
	dressingRoomCanvas.observe( 'cloth:select', function( e ) { showCanvasQuickInformationDetail( e.memo.cursorInfo, e.memo.clothId, e.memo.canvas, "#dressingRoomCanvasQuickInformation" ); } );
	dressingRoomCanvas.observe( 'cloth:select:end', function( e ) { hideCanvasQuickInformation( "#dressingRoomCanvasQuickInformation" ); } );
	dressingRoomCanvas.observe( 'cloth:update', function( e ) 
	{ 
		updateProductCatalogStatus(); 
		updateModelClothsList( e.memo.canvas, "#dressingRoomModelCloths > .modelClothsList", true ); 
	} );
	dressingRoomCanvas.observe( 'canvas:save', function( e ) { updateCreationsList(); } );
	creationsCanvas.observe( 'canvas:load', function( e ) 
	{ 
		updateModelClothsListName( "#dressingRoomModelCloths > .modelClothsList", e.memo.storageName, e.memo.saveObject.name ); 
	} );	
	
	// add event listeners for creations canvas
	creationsCanvas.observe( 'cloth:hover', function( e ) { showCanvasQuickInformationSimple( e.memo.cursorInfo, e.memo.clothId, e.memo.canvas, "#dressingRoomCanvasQuickInformation" ); } );
	creationsCanvas.observe( 'cloth:hover:end', function( e ) { hideCanvasQuickInformation( "#dressingRoomCanvasQuickInformation" ); } );
	creationsCanvas.observe( 'cloth:update', function( e ) 
	{ 		
		updateModelClothsList( e.memo.canvas, "#creationsModelCloths > .modelClothsList", false ); 
	} );
	creationsCanvas.observe( 'canvas:load', function( e ) 
	{ 
		updateModelClothsListName( "#creationsModelCloths > .modelClothsList", e.memo.storageName, e.memo.saveObject.name ); 
	} );
	
	// add event listeners for circle canvasses
	circleCanvas1.observe( 'cloth:hover', function( e ) { showCanvasQuickInformationSimple( e.memo.cursorInfo, e.memo.clothId, e.memo.canvas, "#dressingRoomCanvasQuickInformation" ); } );
	circleCanvas1.observe( 'cloth:hover:end', function( e ) { hideCanvasQuickInformation( "#dressingRoomCanvasQuickInformation" ); } );
	circleCanvas1.observe( 'cloth:update', function( e ) 
	{ 		
		updateModelClothsList( e.memo.canvas, "#circlesWallItem1ClothsList > .modelClothsList", false ); 
	} );
	circleCanvas1.changeModel( 'ladies', 'model2' );
	circleCanvas1.changeBackground( 'background3' );
	circleCanvas1.updateCloth( 'womenTopShortSleeve1' );
	circleCanvas1.updateCloth( 'womenJeans1' );
	circleCanvas1.updateCloth( 'womenBagAndPurse1' );
	circleCanvas1.updateCloth( 'womenHairAccessories1' );
	circleCanvas1.updateCloth( 'womenNormalShoes1' );
	bindModelCanvasButtons( "#circlesWallItem1CanvasArea", circleCanvas1 );
	
	circleCanvas2.observe( 'cloth:hover', function( e ) { showCanvasQuickInformationSimple( e.memo.cursorInfo, e.memo.clothId, e.memo.canvas, "#dressingRoomCanvasQuickInformation" ); } );
	circleCanvas2.observe( 'cloth:hover:end', function( e ) { hideCanvasQuickInformation( "#dressingRoomCanvasQuickInformation" ); } );
	circleCanvas2.observe( 'cloth:update', function( e ) 
	{ 		
		updateModelClothsList( e.memo.canvas, "#circlesWallItem2ClothsList > .modelClothsList", false ); 
	} );
	circleCanvas2.changeModel( 'ladies', 'model1' );
	circleCanvas2.updateCloth( 'womenShortDress4' );
	circleCanvas2.updateCloth( 'womenTights1' );
	circleCanvas2.updateCloth( 'womenNormalShoes3' );
	circleCanvas2.updateCloth( 'womenBagAndPurse3' );
	circleCanvas2.updateCloth( 'womenSunGlasses1' );
	bindModelCanvasButtons( "#circlesWallItem2CanvasArea", circleCanvas2 );		
				
	// initialize scrollables	
  	$( ".scrollableList" ).scrollable( 
   	{    		
		circular: false,
		keyboard: false,
		speed: 1000,
		vertical: false,
		items: '.scrollableItems'
	} );
	$( "#productCatalogList" ).data( "scrollable" ).onSeek( function() 
	{ 
		$( "#productCatalog > div.catalogMenuNavigation > div.catalogMenuNavigationCenter > span" ).text( ( this.getIndex() + 1 ) + "/" + this.getItems().length ); 
	} );
	$( "#creationCatalogList" ).data( "scrollable" ).onSeek( function() 
	{ 
		$( "#creationCatalog > div.catalogMenuNavigation > div.catalogMenuNavigationCenter > span" ).text( ( this.getIndex() + 1 ) + "/" + this.getItems().length ); 
	} );
	
	// call resize handler
	$( window ).resize();	
		
	// animate default model
	$( "#modelListMenu > div.scrollableItems > div:first-child > div.scrollableItem:first-child" ).trigger( 'click' );
	
	// animate product category selection
	$( "#productList > ul#productFilters > li:first-child > span" ).trigger( 'click' );	
		
	// reset product list name of dressing room
	resetModelClothsListName( "#dressingRoomModelCloths > .modelClothsList" );
	
	// bind canvas functions
	bindModelCanvasButtons( "#dressingRoomModelCanvasArea", dressingRoomCanvas );
	bindModelCanvasButtons( "#creationsModelCanvasArea", creationsCanvas );
	
	// store heights of lower menu list of dressing room
	$( ".lowerMenu" ).each( function() 
	{ 
		$( this ).attr( "originalHeight", $( this ).height() ); 
		$( this ).height( "0" ) 
	} );
	
	// update cretions list
	updateCreationsList();
	
	// creations view - comments scrollable pane
	$( ".reviewPanelReviews.tinyScrollBar" ).tinyscrollbar( { sizethumb: 50 } );
	$( "#profileDetail > div.profilePhotoList > div.profilePhotoListScrollable" ).tinyscrollbar( { sizethumb: 25 } );	
	$( "#circlesWall" ).tinyscrollbar( { sizethumb: 50 } );	
	$( "#basketScrollable" ).tinyscrollbar( { sizethumb: 50 } );	
	
	// hide all tabs
	$( "#content > div" ).removeClass( "active" );
	
	// default tab selection -> dressing room
	$( "#leftNavigationList > li.leftNavigationItem#dressingRoomNavItem > a" ).trigger( "click" );	
	
	// finish initial processing image
	stopProcessing();		
} );

// notification
$( "#upperNavigationPanel > #upperNavigationPanelInner > #upperNavigationPanelRight > #upperNavigationPanelRightNotification" ).click( function()
{
	$( "#notificationPanel" ).toggle( 600 );
} );

$( "#notificationPanel > .notificationItem" ).click( function()
{
	$( "#notificationPanel" ).toggle( 600, function()
	{
		$( "#leftNavigationList > li.leftNavigationItem#circlesNavItem > a" ).trigger( "click" );
	} );
} );

// left navigation panel control function
$( "#leftNavigationList > li.leftNavigationItem > a" ).click( function()
{
	if( $( this ).hasClass( "active" ) ) return;

	// deactivate previously active item and fire deselect event
	$( "#leftNavigationList > li.leftNavigationItem > a" ).removeClass( "active" );
	$( "#content > div.active" ).trigger( "object:deselect" );
	$( "#content > div" ).removeClass( "active" );
	// activate current item and fire select event
	$( this ).addClass( "active" );
	$( $( this ).attr( "target" ) ).addClass( "active" );
	$( $( this ).attr( "target" ) ).trigger( "object:select" );
} );

// upper panel functions
$( "#upperNavigationPanel > #upperNavigationPanelInner > #upperNavigationPanelRight > #upperNavigationPanelRightUserName, \
    #upperNavigationPanel > #upperNavigationPanelInner > #upperNavigationPanelRight > #upperNavigationPanelUserIcon" ).click( function()
{
	$( "#leftNavigationList > li.leftNavigationItem#profileNavItem > a" ).trigger( "click" );		
} );

// Processing image
function startProcessing()
{
	var count = $( "#progressDiv" ).data( "showCount" );
	$( "#progressDiv" ).data( "showCount", ( count + 1 ) );
		
	if( $( "#progressDiv" ).data( "showCount" ) > 0 )
	{
		$( "#progressDiv" ).addClass( "active" );
	}
}

function stopProcessing( force )
{	
	var count = $( "#progressDiv" ).data( "showCount" );
	$( "#progressDiv" ).data( "showCount", ( count - 1 ) );
	
	if( ( $( "#progressDiv" ).data( "showCount" ) <= 0 ) || 
	    ( force === true ) )
	{
		$( "#progressDiv" ).removeClass( "active", 250 );
		$( "#progressDiv" ).data( "showCount", 0 );
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dressing Room Control Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////
// dressing room select/deselect handler
$( "#dressingRoom" ).unbind( "object:select" ).bind( "object:select", function()
{	
	dressingRoomCanvas.calcOffset();
	updateCatalogMenuSize( $( "#dressingRoom" ), 
						   $( "#productCatalog" ), 
						   function()
						   {
							   updateCatalogMenu( $( "#productCatalog" ),
												  getClothes( $( "#productList li.active" ).attr( 'category' ) ),
												  createProductItem,
												  updateProductCatalogStatus ); 
						   } );
} );
$( "#dressingRoom" ).unbind( "object:deselect" ).bind( "object:deselect", function()
{
	dressingRoomCanvas.objectNoHover();
	dressingRoomCanvas.objectNoSelection();
	$( "#lowerNavigationList > li.toggleMenu.active" ).trigger( "click" );
} );

// model list control function
$( "#modelListMenu > div.scrollableItems div.scrollableItem" ).click( function() 
{
	// see if same thumb is being clicked
	if( $(this).hasClass( "active" ) ) { return; }

	if( $( this ).attr( "gender" ) != undefined && $( this ).attr( "model-id" ) != undefined )
	{	
		// start processing
		startProcessing();						
		
		// change model
		dressingRoomCanvas.changeModel( $( this ).attr( "gender" ), $( this ).attr( "model-id" ) );
	
		// activate item
		$( "#modelListMenu > div.scrollableItems div.scrollableItem" ).removeClass( "active" );
		$( this ).addClass( "active" );
		
		// stop processing
		stopProcessing();
	}
	else
	{
		$.alerts.okButton = '&nbsp;Tamam&nbsp;';
		jAlert( "Bu manken beta versiyonunda bulunmuyor", "Uyarı" );
	}
} );	
// background list control function
$( "#backgroundListMenu > div.scrollableItems div.scrollableItem" ).click( function() 
{
	// see if same thumb is being clicked
	if( $(this).hasClass( "active" ) ) { return; }

	// start processing
	startProcessing();						
	
	// update background
	dressingRoomCanvas.changeBackground( $( this ).attr( "background-id" ) );

	// activate item
	$( "#backgroundListMenu > div.scrollableItems div.scrollableItem" ).removeClass( "active" );
	$( this ).addClass( "active" );
	
	// stop processing
	stopProcessing();
} );

// lower menu functions
$( "#lowerNavigationList > li.toggleMenu" ).click( function() 
{
	// see if selected then unselect and close it
	if( $( this ).hasClass( "active" ) ) 
	{ 
		$( this ).removeClass( "active" );
		var objectToHide = $( $( this ).attr( 'target' ) );		
		objectToHide.animate( { 'height': '0' }, 500, function() { objectToHide.hide(); } );
	}
	else
	{
		var objectToHide = $( $( "#lowerNavigationList > li.toggleMenu.active" ).attr( 'target' ) );
		objectToHide.animate( { 'height': '0' }, 300, function() { objectToHide.hide(); });
		$( "#lowerNavigationList > li.toggleMenu" ).removeClass( "active" );		
		$( this ).addClass( "active" );			
		var objectToShow = $( $( this ).attr( 'target' ) );
		objectToShow.show();	
		objectToShow.animate( { 'height': objectToShow.attr( 'originalHeight' ) }, 600 );
	}
} );
$( "#lowerNavigationList > li#lowerNavigationSave" ).click( function()
{	
	var modelClothsListNameField = $( ".modelCloths > .modelClothsList > li.modelClothsListName > textarea" );
	var modelClothsListId = modelClothsListNameField.attr( "listId" );
	var modelClothsListName = modelClothsListNameField.val();
	
	// create a list id if not existent
	var saveMessage = 'Varolan görünümü aşağıdaki isimle güncellemek istiyor musunuz?';
	if( ! modelClothsListId )
	{
		modelClothsListId = "hipmoni-creation-" + Math.uuid();
		saveMessage = 'Görünümü aşağıdaki isimle kaydetmek istiyor musunuz?';	
	}
	
	// get save name
	$.alerts.okButton = '&nbsp;Evet&nbsp;';
	$.alerts.cancelButton = '&nbsp;Hayır&nbsp;';
	jPrompt( saveMessage, modelClothsListName, 'Görünüm Kaydet', function( newValue ) 
	{    					
		if( newValue )
		{
			startProcessing();		
			localStorage.removeItem( $( this ).attr( "creation-id" )  ); 					
			updateModelClothsListName( "#dressingRoomModelCloths > .modelClothsList", modelClothsListId, newValue );		
			dressingRoomCanvas.save( modelClothsListId, newValue );		
			stopProcessing();
		}
	} );		
} );
$( "#lowerNavigationList > li#lowerNavigationNew" ).click( function()
{		
	$.alerts.okButton = '&nbsp;Evet&nbsp;';
	$.alerts.cancelButton = '&nbsp;Hayır&nbsp;';
	jConfirm( 'Varolan tasarımı kapatıp yeni bir tasarım yaratmak istiyor musunuz?<br>' + 
		      'Aktif tasarımdaki kaydedilmemiş değişiklikler kaybolacaktır!', 'Yeni Kayıt', function( answer ) 
	{    			
		if( answer )
		{									
			// reset model cloths list
			dressingRoomCanvas.removeAllCloths();
			
			// reset model cloths list name
			resetModelClothsListName( "#dressingRoomModelCloths > .modelClothsList" );	
		}
	} );		
} );

// product list control function
$( "#productList li > span" ).click( function()
{
	var target = $( this ).parent();
	
	// check current is active
	if( target.hasClass( "active" ) ) return;
	
	// remove current active one
	$( "#productList li.active" ).removeClass( "active" );	
	
	// check if has subcategories
	if( target.hasClass( "folded" ) || target.hasClass( "unfolded" ) )
	{
		// change active item to first child
		target.children( "ul" ).find( "li:first-child" ).addClass( "active" );		
		
		// change list folding
		$( "#productList li.unfolded" ).removeClass( "unfolded" ).addClass( "folded" );
		target.removeClass( "folded" ).addClass( "unfolded" );
	}
	else
	{
		target.addClass( "active" );	
	}
	
	// update product catalog with active item
	updateCatalogMenu( $( "#productCatalog" ),
					   getClothes( $( "#productList li.active" ).attr( 'category' ) ),					   
					   createProductItem,
					   updateProductCatalogStatus );
	
} );
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dressing Room Control Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creations View Control Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////
// creations select/deselect handler
$( "#creations" ).unbind( "object:select" ).bind( "object:select", function()
{	
	creationsCanvas.calcOffset();
	updateCatalogMenuSize( $( "#creations" ),
						   $( "#creationCatalog" ), 
						   updateCreationsList );
} );
$( "#creations" ).unbind( "object:deselect" ).bind( "object:deselect", function()
{
	creationsCanvas.objectNoHover();
	creationsCanvas.objectNoSelection();
} );
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creations View Control Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Quick Information View Functions - Used for All Canvas Objects
////////////////////////////////////////////////////////////////////////////////////////////////////////
function showCanvasQuickInformationSimple( cursorPosition, clothId, canvasObject, informationWindowId )
{	
	// cloth object and category
	var selectedCloth = getCloth( clothId );	
	var selectedClothCategory = getProductCategory( selectedCloth.categoryId );
	
	// update brand image, product name, product price
	$( informationWindowId + " > .informationPanel > .informationPanelInner > .informationPanelBrandLogo > img" ).
		attr( "src", "images/brandLogos/" + selectedCloth.brand + ".png" );
	$( informationWindowId + " > .informationPanel > .informationPanelInner > .informationPanelProductInformation > .informationPanelProductCategory > span" ).
		text( selectedClothCategory.categoryName );
	$( informationWindowId + " > .informationPanel > .informationPanelInner > .informationPanelProductInformation > .informationPanelProductPrice > span" ).
		text( selectedCloth.price.toFixed( 2 ) + " TL" );
		
	// update cloth id tag
	$( informationWindowId ).attr( "clothId", clothId );
	
	// hide detailed information
	$( informationWindowId + " > div:not( .informationPanel )" ).hide()
	$( informationWindowId + " > .informationPanel" ).show();
	$( informationWindowId ).css( { 'left': cursorPosition.pageX + 15, 'top': cursorPosition.pageY - 10 } );
	$( informationWindowId ).show();
}

function hideCanvasQuickInformation( informationWindowId )
{
	$( informationWindowId ).hide();
}

function showCanvasQuickInformationDetail( cursorPosition, clothId, canvasObject, informationWindowId )
{	
	// cloth object and canvas cloth object
	var selectedCloth = getCloth( clothId );	
	var selectedCanvasCloth = canvasObject.findObject( "clothId", clothId );

	// show hover information
	showCanvasQuickInformationSimple( cursorPosition, clothId, canvasObject, informationWindowId );

	// update button clicks
	$( informationWindowId + " > .controlPanel > .controlPanelInner > .controlPanelDetailView" ).unbind( 'click' ).bind( 'click', function( e ) { if ( e.which == 1 ) 
	{ 
		$.alerts.okButton = '&nbsp;Tamam&nbsp;';
	 	jAlert( "Detaylı Ürün Görünümü Beta Sürümünde Bulunmamaktadır", "Uyarı" );
	} } );
	$( informationWindowId + " > .controlPanel > .controlPanelInner > .controlPanelTakeOff" ).unbind( 'click' ).bind( 'click', { canvasObject: canvasObject, clothId: clothId }, function( e ) 
	{ 
		if ( e.which == 1 ) 
		{ 
			updateCanvasCloth( e.data.canvasObject, e.data.clothId ); 
		} 
	} );

	// set color text to default
	var colorNameSpan = $( informationWindowId + " > .colorOptionsPanel > .colorOptionsPanelInner > .colorOptionsColorName > .colorOptionsColorNameSpan" );
	colorNameSpan.text( selectedCanvasCloth.getActiveColor().colorName );

	// destroy past color pallette
	var colorOptionsColorPallette = $( informationWindowId + " > .colorOptionsPanel > .colorOptionsPanelInner > .colorOptionsColorPallette" );
	colorOptionsColorPallette.children().remove();
	
	// create new color palette - add available colors 
	var colorPalletteTable = $( document.createElement( 'table' ) );
	colorOptionsColorPallette.append( colorPalletteTable );
	
	// create colors table row
	var colorPalletteTableRow = $( document.createElement( 'tr' ) );
	colorPalletteTable.append( colorPalletteTableRow );
	
	// add all colors as table columns
	for( var colorItem in selectedCloth.clothColors )
	{
		var colorPalletteTableColumn = $( document.createElement( 'td' ) );
		colorPalletteTableRow.append( colorPalletteTableColumn );
		
		var colorDiv = $( document.createElement( 'div' ) );		
		colorDiv.css( "background-color", selectedCloth.clothColors[ colorItem ].colorCode );
		colorDiv.attr( "colorName", selectedCloth.clothColors[ colorItem ].colorName );
		colorDiv.unbind( 'mouseenter' ).bind( 'mouseenter', { informationWindowId: informationWindowId }, function( e ) 
		{ 
			 $( e.data.informationWindowId + " > .colorOptionsPanel > .colorOptionsPanelInner > .colorOptionsColorName > .colorOptionsColorNameSpan" ).text( $( this ).attr( "colorName" ) ); 
		} ); 
		colorDiv.unbind( 'mouseleave' ).bind( 'mouseleave', { informationWindowId: informationWindowId, colorName: selectedCloth.clothColors[ colorItem ].colorName }, function( e ) 
		{ 
			 $( e.data.informationWindowId + " > .colorOptionsPanel > .colorOptionsPanelInner > .colorOptionsColorName > .colorOptionsColorNameSpan" ).text( 
			 	$( informationWindowId + " > .colorOptionsPanel > .colorOptionsPanelInner > .colorOptionsColorPallette > table > tbody > tr > td > div.active" ).attr( "colorName" ) ); 
		} );
		colorDiv.unbind( 'click' ).bind( 'click', 
										 { informationWindowId: informationWindowId, canvasObject: canvasObject, clothId: clothId, colorId: selectedCloth.clothColors[ colorItem ].colorId },  
										 function( e ) 
		{ 
			if ( e.which == 1 ) 
			{ 
				$( e.data.informationWindowId + " > .colorOptionsPanel > .colorOptionsPanelInner > .colorOptionsColorPallette > table > tbody > tr > td > div" ).removeClass( "active" ); 
				$( this ).addClass( "active" ); 
				var canvasCloth = e.data.canvasObject.findObject( "clothId", e.data.clothId );
				canvasCloth.selectedColor = e.data.colorId; 
				canvasCloth.updateImage();
				e.data.canvasObject.deactivateAllWithDispatch();
			} 
		} );
		
		if( selectedCloth.clothColors[ colorItem ].colorId === selectedCanvasCloth.selectedColor )
		{
			colorDiv.addClass( "active" );
		}		
		colorPalletteTableColumn.append( colorDiv );
	}
	
	// create size list
	var sizeOptionsList = $( informationWindowId + " > .sizeOptionsPanel > .sizeOptionsPanelInner > .sizeOptionsList" );
	sizeOptionsList.children().remove();
	
	// create new size list - add available sizes 
	var sizeOptionsTable = $( document.createElement( 'table' ) );
	sizeOptionsList.append( sizeOptionsTable );
	
	// create sizes table row
	var sizeOptionsTableRow = $( document.createElement( 'tr' ) );
	sizeOptionsTable.append( sizeOptionsTableRow );
	for( var sizeItem in selectedCloth.clothSizes )
	{
		var sizeOptionsTableColumn = $( document.createElement( 'td' ) );
		sizeOptionsTableRow.append( sizeOptionsTableColumn );
		
		var sizeSpan = $( document.createElement( 'span' ) );
		sizeSpan.text( selectedCloth.clothSizes[ sizeItem ].sizeName );		
		sizeSpan.unbind( 'click' ).bind( 'click', 
								         { informationWindowId: informationWindowId, canvasObject: canvasObject, clothId: clothId, sizeId: selectedCloth.clothSizes[ sizeItem ].sizeId }, 
										 function( e ) 
		{ 
			if ( e.which == 1 ) 
			{ 
				$( e.data.informationWindowId + " > .sizeOptionsPanel > .sizeOptionsPanelInner > .sizeOptionsList > table > tbody > tr > td > span" ).removeClass( "active" ); 
				$( this ).addClass( "active" ); 
				e.data.canvasObject.findObject( "clothId", e.data.clothId ).selectedSize = e.data.sizeId; 
			} 
		} );
		
		if( selectedCloth.clothSizes[ sizeItem ].sizeId === selectedCanvasCloth.selectedSize )
		{
			sizeSpan.addClass( "active" );
		}
		sizeOptionsTableColumn.append( sizeSpan );
	}
	
	// destroy past cloth order divs
	$( informationWindowId + " > div.clothOrderPanel" ).remove();
	
	// cloths below divs	
	var clothsBelow = canvasObject.getClothsBelow( clothId );
	for( var i = 0, length = clothsBelow.length; i < length; i++ )
	{		
		var changeClothSpan = $( document.createElement( 'span' ) );
		changeClothSpan.text( getProductCategory( getCloth( clothsBelow[ i ] ).categoryId ).categoryName + " altına giy" );					
	
		var clothBelowInner = $( document.createElement( 'div' ) );
		clothBelowInner.append( changeClothSpan );
		clothBelowInner.unbind( 'click' ).bind( 'click', { canvasObject: canvasObject, clothId: clothId, targetId: clothsBelow[ i ] }, function( e ) 
		{ 
			if ( e.which == 1 ) 
			{
				var targetObject = e.data.canvasObject.findObject( "clothId", e.data.targetId );
				var selectedObject = e.data.canvasObject.findObject( "clothId", e.data.clothId );
				e.data.canvasObject.swapObjects( targetObject, selectedObject );
				e.data.canvasObject.deactivateAllWithDispatch();
			}
		});
		
		var clothBelow = $( document.createElement( 'div' ) );
		clothBelow.addClass( "clothOrderPanel" );						
		clothBelow.append( clothBelowInner );
		
		$( informationWindowId ).append( clothBelow );
	}
	
	// cloths over divs
	var clothsOver = canvasObject.getClothsOver( clothId );
	for( var i = 0, length = clothsOver.length; i < length; i++ )
	{			
		var changeClothSpan = $( document.createElement( 'span' ) );
		changeClothSpan.text( getProductCategory( getCloth( clothsOver[ i ] ).categoryId ).categoryName + " üzerine giy" );					
	
		var clothOverInner = $( document.createElement( 'div' ) );
		clothOverInner.append( changeClothSpan );
		clothOverInner.unbind( 'click' ).bind( 'click', { clothId: clothId, targetId: clothsOver[ i ] }, function( e ) 
		{ 
			if ( e.which == 1 ) 
			{
				var targetObject = e.data.canvasObject.findCanvasObject( "clothId", e.data.targetId );
				var selectedObject = e.data.canvasObject.findCanvasObject( "clothId", e.data.clothId );
				e.data.canvasObject.swapObjects( targetObject, selectedObject );
				e.data.canvasObject.deactivateAllWithDispatch();
			}
		});
		
		var clothOver = $( document.createElement( 'div' ) );
		clothOver.addClass( "clothOrderPanel" );						
		clothOver.append( clothOverInner );
		
		$( informationWindowId ).append( clothOver );
	}	
	
	// show all divs inside
	$( informationWindowId + " > div" ).show();
	$( informationWindowId ).css( { 'left': cursorPosition.pageX + 15, 'top': cursorPosition.pageY - 50 } );
	$( informationWindowId ).show();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Quick Information View Functions - Used for All Canvas Objects
////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////
// Catalog Menu Functions - Used for All Scrollable Catalog Menus
////////////////////////////////////////////////////////////////////////////////////////////////////////
// update product catalog width and number of elements to show
function updateCatalogMenuSize( parentObject, catalogObject, updateFunction )
{		
	var parentLeftPadding = parseInt( parentObject.css( "padding-left" ) );
	var parentRightPadding = parseInt( parentObject.css( "padding-right" ) );
	var parentInnerWidth = ( parentObject.innerWidth() - ( parentLeftPadding + parentRightPadding ) ); 
	var catalogAvailableWidth = ( ( parentInnerWidth + parentLeftPadding ) - catalogObject.position().left ); 	
	var numberOfItemsPerRow = Math.floor( catalogAvailableWidth / catalogObject.data( "columnWidth" ) );
	
	if( numberOfItemsPerRow != catalogObject.data( "numberOfColumns" ) )
	{
		catalogObject.data( "numberOfColumns", numberOfItemsPerRow );
		catalogObject.css( "padding-left", ( catalogAvailableWidth - ( numberOfItemsPerRow * catalogObject.data( "columnWidth" ) ) ) );		
		
		if( updateFunction )
		{
			updateFunction();
		}
	}
	else
	{
		catalogObject.css( "padding-left", ( catalogAvailableWidth - ( numberOfItemsPerRow * catalogObject.data( "columnWidth" ) ) ) );
	}
}

function updateCatalogMenu( catalogMenuObject, objectList, scrollableMenuItemCreateFunction, scrollableUpdateFunction )
{
	// start processing
	startProcessing();
	
	// clear current catalogues
	var scrollableObject =  catalogMenuObject.children( ".scrollableList" ).scrollable();
	scrollableObject.getItems().remove();
		
	// create new scrollable items according to number of elements
	// each scrollable has ( #rows * #cols ) elements
	var numberOfObjectsPerScrollable = ( catalogMenuObject.data( "numberOfRows" ) * catalogMenuObject.data( "numberOfColumns" ) );
	var numberOfScrollables = Math.ceil( objectList.length / numberOfObjectsPerScrollable );
	for( var i = 0; i < numberOfScrollables; i++ )
	{
		var scrollableListItem = createCatalogListItem( catalogMenuObject,
														objectList.slice( i * numberOfObjectsPerScrollable, 
																		  Math.min( objectList.length, ( i + 1 ) * numberOfObjectsPerScrollable ) ),
														scrollableMenuItemCreateFunction );
		scrollableObject.addItem( scrollableListItem );
	}
	
	// update scrollable navigation numbers
	catalogMenuObject.find( "div.catalogMenuNavigation > div.catalogMenuNavigationCenter > span" ).text(
		( scrollableObject.getIndex() + 1 ) + "/" + scrollableObject.getItems().length );
		
	// hide if only one item
	if( scrollableObject.getItems().length > 1 )
	{
		catalogMenuObject.find( "div.catalogMenuNavigation > div.catalogMenuNavigationCenter" ).show();
	}
	else
	{
		catalogMenuObject.find( "div.catalogMenuNavigation > div.catalogMenuNavigationCenter" ).hide();
	}

	// update statuses
	if( scrollableUpdateFunction )		
	{
		scrollableUpdateFunction();
	}	
	
	// go to first page
	scrollableObject.seekTo( 0, 0 );
		
	// stop processing
	stopProcessing();
}

function createCatalogListItem( catalogMenuObject, objectList, scrollableItemCreateFunction )
{
	// create div item
	var catalogMenuListItem = $( document.createElement( 'div' ) );
	catalogMenuListItem.width( ( catalogMenuObject.data( "columnWidth" ) * catalogMenuObject.data( "numberOfColumns" ) ) + "px" );
	catalogMenuListItem.addClass( "catalogMenuListItem" );
	
	// create inner table
	var catalogMenuListItemTable = $( document.createElement( 'table' ) );
	catalogMenuListItemTable.attr( { "cellpadding" : "0", "cellspacing" : "0", "align" : "center", "valign" : "middle" } );
	catalogMenuListItemTable.addClass( "catalogMenuListItemTable" );
	catalogMenuListItem.append( catalogMenuListItemTable );
	
	// create rows and columns
	for( var i = 0; i < catalogMenuObject.data( "numberOfRows" ); i++ )
	{
		catalogMenuListItemTableRow = $( document.createElement( 'tr' ) );
		catalogMenuListItemTableRow.height( ( 100 / catalogMenuObject.data( "numberOfRows" ) ) + "%" );
		catalogMenuListItemTable.append( catalogMenuListItemTableRow );
		
		for( var j = 0; j < catalogMenuObject.data( "numberOfColumns" ); j++ )
		{
			var catalogMenuListItemTableColumn = $( document.createElement( 'td' ) );
			catalogMenuListItemTableColumn.width( ( 100 / catalogMenuObject.data( "numberOfColumns" ) ) + "%" )
			catalogMenuListItemTableRow.append( catalogMenuListItemTableColumn );
		}
	}
	
	// distribute items over rows
	var listLength = objectList.length;
	for( var i = 0; i < listLength; i++ )
	{		
		// find column object to populate
		// fill order is below for 3x3
		// 0 3 6
		// 1 4 7
		// 2 5 8
		var columnPosition = Math.floor( i / catalogMenuObject.data( "numberOfRows" ) );
		var rowPosition = ( i - ( columnPosition * catalogMenuObject.data( "numberOfRows" ) ) );
		var columnObject = catalogMenuListItemTable.children( "tbody" ).eq( 0 ).children( "tr" ).eq( rowPosition ).children( "td" ).eq( columnPosition );
		
		// create product item and append to given column item
		scrollableItemCreateFunction( columnObject, objectList[ i ] );
	}
	
	return catalogMenuListItem;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Catalog Menu Functions - Used for All Scrollable Catalog Menus
////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////
// Product Catalog Functions - Dressing Room
////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateProductCatalogStatus()
{
	// clear all worn attributes
	$( "#productCatalog > #productCatalogList table.catalogMenuListItemTable > tbody > tr > td" ).removeClass( "active" );
	
	var objects = ( dressingRoomCanvas ? dressingRoomCanvas.getObjects() : [] );
	var objectsLength = objects.length;
	for( var i = 0; i < objectsLength; i++ )
	{
		if( objects[ i ] instanceof CanvasCloth )
		{
			// add worn attribute
			$( "#productCatalog > #productCatalogList table.catalogMenuListItemTable > tbody > tr > td[clothId=" + objects[ i ].clothId + "]" ).addClass( "active" );
		}
	}
}

function createProductItem( catalogListItemTableColumn, clothId )
{
	// cloth item
	var clothItem = getCloth( clothId );
	
	// add attribute
	catalogListItemTableColumn.attr( "clothId", clothId );

	// update column item
	catalogListItemTableColumn.unbind( 'click' ).bind( 'click', { canvasObject: dressingRoomCanvas, clothId: clothId }, function( e ) 
	{ 
		if ( e.which == 1 ) 
		{ 
			updateCanvasCloth( e.data.canvasObject, e.data.clothId ); 
		} 
	} );	
	
	// create main div
	var productCatalogItem = $( document.createElement( 'div' ) );
	productCatalogItem.addClass( "catalogMenuItem" );
	productCatalogItem.addClass( "productCatalogItem" );
	catalogListItemTableColumn.append( productCatalogItem );
	
	// check new item
	if( ProductCategories[ 'womenNew' ].clothList.indexOf( clothId ) >= 0 )
	{
		// create new item image div
		var newItemImage = $( document.createElement( 'img' ) );
		newItemImage.attr( "src", "images/new.png" );
		newItemImage.addClass( "newItem" );
		productCatalogItem.append( newItemImage );
	}
	
	// check sale item
	if( ProductCategories[ 'womenSale' ].clothList.indexOf( clothId ) >= 0 )
	{
		// create sale item image div
		var saleItemImage = $( document.createElement( 'img' ) );
		saleItemImage.attr( "src", "images/sale.png" );
		saleItemImage.addClass( "saleItem" );
		productCatalogItem.append( saleItemImage );
	}
	
	// create product image div
	var productCatalogItemImage = $( document.createElement( 'div' ) );
	productCatalogItemImage.addClass( "productCatalogItemImage" );
	productCatalogItem.append( productCatalogItemImage );	
		
	// create image inner div
	var productCatalogItemImageInnerDiv = $( document.createElement( 'div' ) );
	productCatalogItemImage.append( productCatalogItemImageInnerDiv );
	
	// create image
	var productCatalogItemImageObject = $( document.createElement( 'img' ) );
	productCatalogItemImageObject.attr( "src", "images/catalogItems/" + clothItem.categoryId + "/" + clothId + "/preview.png" );
	productCatalogItemImageInnerDiv.append( productCatalogItemImageObject );
	
	// create cloth information div
	var productCatalogItemInformation = $( document.createElement( 'div' ) );
	productCatalogItemInformation.addClass( "productCatalogItemInformation" );
	productCatalogItem.append( productCatalogItemInformation );
	
	// create brand logo div
	var brandLogo = $( document.createElement( 'div' ) );
	brandLogo.addClass( "brandLogo" );
	productCatalogItemInformation.append( brandLogo );
	
	// create brand logo
	var brandLogoObject = $( document.createElement( 'img' ) );
	brandLogoObject.attr( "src", "images/brandLogos/" + clothItem.brand + ".png" );
	brandLogo.append( brandLogoObject );
	
	// create name and price div
	var productCatalogItemNameAndPrice = $( document.createElement( 'div' ) );
	productCatalogItemNameAndPrice.addClass( "productCatalogItemNameAndPrice" );
	productCatalogItemInformation.append( productCatalogItemNameAndPrice );
	
	// create category name
	var productCatalogItemName = $( document.createElement( 'span' ) );
	productCatalogItemName.text( getProductCategory( clothItem.categoryId ).categoryName );
	productCatalogItemNameAndPrice.append( productCatalogItemName );
	// create product price
	var productCatalogItemPrice = $( document.createElement( 'span' ) );
	productCatalogItemPrice.text( clothItem.price.toFixed( 2 ) + " TL" );
	productCatalogItemNameAndPrice.append( productCatalogItemPrice );
	
	// create cloth options div
	var productCatalogItemOptions = $( document.createElement( 'div' ) );
	productCatalogItemOptions.addClass( "productCatalogItemOptions" );	
	productCatalogItem.append( productCatalogItemOptions );
	
	// create colors_table
	var colorPalletteTable = $( document.createElement( 'table' ) );
	productCatalogItemOptions.append( colorPalletteTable );
	
	// create colors table row
	var colorPalletteTableRow = $( document.createElement( 'tr' ) );
	colorPalletteTable.append( colorPalletteTableRow );
	
	// add all colors as table columns, stop if maximum length is reached
	for( var colorItem in clothItem.clothColors )
	{
		var colorPalletteTableColumn = $( document.createElement( 'td' ) );
		colorPalletteTableRow.append( colorPalletteTableColumn );
		
		var colorDiv = $( document.createElement( 'div' ) );
		colorDiv.addClass( "color" );
		colorDiv.css( "background-color", clothItem.clothColors[ colorItem ].colorCode );
		colorPalletteTableColumn.append( colorDiv );
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Product Catalog Functions - Dressing Room
////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////
// Canvas Area Functions - Used By DressingRoom and Creations
////////////////////////////////////////////////////////////////////////////////////////////////////////
// update canvas cloth
function updateCanvasCloth( canvasObject, clothId )
{
	// processing image
	startProcessing();
	
	// wear/remove cloth on canvas
	canvasObject.updateCloth( clothId );
	
	// stop processing
	stopProcessing();	
}

function updateModelClothsList( canvasObject, modelClothsMenuId, removeButtonActive )
{		
	var totalBill = 0.0;
	$( modelClothsMenuId + " > li.modelClothsListItem" ).remove();
	var objects = ( canvasObject ? canvasObject.getObjects() : [] );
	var objectsLength = objects.length;
	for( var i = ( objectsLength - 1 ); i >= 0; i-- )
	{
		if( objects[ i ] instanceof CanvasCloth )
		{
			var selectedCloth = getCloth( objects[ i ].clothId );
			var modelClothsListItem = $( document.createElement( 'li' ) );
			modelClothsListItem.addClass( "modelClothsListItem" );		
						
			totalBill += parseFloat( selectedCloth.price );
			
			// remove button
			if( removeButtonActive )
			{				
				var removeIconImage = $( document.createElement( 'img' ) );
				removeIconImage.attr( "src", "images/remove_icon.png" );
				removeIconImage.addClass( "removeIcon" );
				removeIconImage.unbind( 'click' ).bind( 'click', { canvasObject: canvasObject, clothId: objects[ i ].clothId }, function( e ) 
				{ 
					if ( e.which == 1 ) 
					{ 
						updateCanvasCloth( e.data.canvasObject, e.data.clothId ); 
					} 
				} );
				modelClothsListItem.append( removeIconImage );
			}
			
			// text
			var modelClothsListItemText = $( document.createElement( 'span' ) );
			modelClothsListItemText.text( getProductCategory( selectedCloth.categoryId ).categoryName + " - " + selectedCloth.price.toFixed( 2 ) + " TL" );
			modelClothsListItemText.unbind( 'mousemove' ).bind( 'mousemove', { canvasObject: canvasObject, clothId: objects[ i ].clothId }, function( e ) 
			{ 
				var canvasClothObject = e.data.canvasObject.findObject( "clothId", e.data.clothId );
				e.data.canvasObject.objectHover( e, canvasClothObject );
			} ); 
			modelClothsListItemText.unbind( 'mouseleave' ).bind( 'mouseleave', { canvasObject: canvasObject }, function( e ) 
			{ 
				 e.data.canvasObject.objectNoHover( );
			} );
			modelClothsListItemText.unbind( 'click' ).bind( 'click', function( e ) { if ( e.which == 1 ) 
			{ 
				$.alerts.okButton = '&nbsp;Tamam&nbsp;';
				jAlert( "Detaylı Ürün Görünümü Beta Sürümünde Bulunmamaktadır", "Uyarı" );
			} } );
			modelClothsListItem.append( modelClothsListItemText );
			
			$( modelClothsMenuId + " > li.modelClothsListName" ).after( modelClothsListItem );
		}
	}
	
	// update total count
	$( modelClothsMenuId + " > li.modelClothsListTotal > span.totalAmount" ).text( totalBill.toFixed( 2 ) + " TL" );
}

function updateModelClothsListName( modelClothsMenuId, modelClothsListId, modelClothsListName )
{
	// update canvas products list name
	var modelClothsListNameField = $( modelClothsMenuId + " > li.modelClothsListName > textarea" );
	modelClothsListNameField.val( modelClothsListName );
	modelClothsListNameField.attr( "listId", modelClothsListId );
}

function resetModelClothsListName( modelClothsMenuId )
{
	var modelClothsListNameField = $( modelClothsMenuId + " > li.modelClothsListName > textarea" );
	modelClothsListNameField.val( "Yeni Tasarım" );
	modelClothsListNameField.removeAttr( "listId" );
}

// model cloths list button functions
$( ".modelCloths > .modelClothsList > li.modelClothsListButtons > img.addToBasket" ).click( function()
{
	var objects = ( dressingRoomCanvas ? dressingRoomCanvas.getObjects() : [] );
	var objectsLength = objects.length;
	for( var i = ( objectsLength - 1 ); i >= 0; i-- )
	{
		if( objects[ i ] instanceof CanvasCloth )
		{
			var selectedCloth = getCloth( objects[ i ].clothId );
			
			// basket element
			var basketItem = $( document.createElement( "tr" ) );
			basketItem.html( "<td class=\"basketTableItemPhoto basketTableAlignCenter\" onClick=\"$.alerts.okButton = '&nbsp;Tamam&nbsp;';									\
	 																					jAlert( 'Detaylı Ürün Görünümü Beta Sürümünde Bulunmamaktadır', 'Uyarı' );\">		\
								<img src=\"images/catalogItems/" + selectedCloth.categoryId + "/" + objects[ i ].clothId + "/preview.png\">									\
							  </td>																																			\
							  <td class=\"basketTableItemInformation basketTableAlignLeft\" onClick=\"$.alerts.okButton = '&nbsp;Tamam&nbsp;';								\
	 																						jAlert( 'Detaylı Ürün Görünümü Beta Sürümünde Bulunmamaktadır', 'Uyarı' );\">	\
								<div class=\"basketTableItemBrand\">																										\
									<img src=\"images/brandLogos/" + selectedCloth.brand + ".png\">																			\
								</div>																																		\
								<div class=\"basketTableItemDetails\">																										\
									<div class=\"basketTableItemDetailsType\">" + getProductCategory( selectedCloth.categoryId ).categoryName + "</div></br>				\
									<div>Renk: " + selectedCloth.clothColors[ objects[ i ].selectedColor ].colorName + "</span></div>										\
									<div class=\"basketTableItemColorImage\" style=\"background-color: " + 
										selectedCloth.clothColors[ objects[ i ].selectedColor ].colorCode + ";\"></div></br>												\
									<div>Beden: " + selectedCloth.clothSizes[ objects[ i ].selectedSize ].sizeName + "</div>												\
								</div>																																		\
							  </td>																																			\
							  <td class=\"basketTableItemQuantity basketTableAlignCenter\">																					\
								<select onchange=\"var Total=(parseFloat($(this).parent().siblings('.basketTableItemPrice').children('.optionPrice').text())*parseFloat($(this).val())); \
											       $(this).parent().siblings('.basketTableItemTotal').children('.optionPrice').text(Total.toFixed(2));		 				\
												   updateBasket(); return false;\">																							\
									<option value=\"0\">0</option>																											\
									<option value=\"1\" selected=\"selected\">1</option>																					\
									<option value=\"2\">2</option>																											\
									<option value=\"3\">3</option>																											\
									<option value=\"4\">4</option>																											\
									<option value=\"5\">5</option>																											\
									<option value=\"6\">6</option>																											\
									<option value=\"7\">7</option>																											\
									<option value=\"8\">8</option>																											\
									<option value=\"9\">9</option>																											\
									<option value=\"10\">10</option>																										\
								</select>																																	\
								<div class=\"basketTableItemRemove\" onclick=\"$( this ).parent().parent().remove(); updateBasket(); return false;\">Çıkar</div>			\
							  </td> 																																		\
							  <td class=\"basketTableItemPrice basketTableAlignRight\">																						\
								<span class=\"optionPrice\">" + selectedCloth.price.toFixed( 2 ) + "</span><span class=\"sizeOptionsSizeNameSpan\"> TL</span>				\
							  </td>																																			\
							  <td class=\"basketTableItemTotal basketTableAlignRight\">																						\
								<span class=\"optionPrice\">" + selectedCloth.price.toFixed( 2 ) + "</span><span class=\"sizeOptionsSizeNameSpan\"> TL</span>				\
							  </td>" );
							  
			// add to list
			$( "#basketTable tr:first" ).after( basketItem );
		}
	}
			
	$( "#leftNavigationList > li.leftNavigationItem#basketNavItem > a" ).trigger( "click" );
} );

// canvas functions
function modelCanvasRedo( canvasObject )
{
	$.alerts.okButton = '&nbsp;Tamam&nbsp;';
	jAlert( "Değişiklikleri ileri geri alma özelliği beta versiyonunda bulunmamaktadır", "Uyarı" );
}

function modelCanvasUndo( canvasObject )
{	
	$.alerts.okButton = '&nbsp;Tamam&nbsp;';
	jAlert( "Değişiklikleri ileri geri alma özelliği beta versiyonunda bulunmamaktadır", "Uyarı" );
}

function modelCanvasRotate( canvasObject )
{
	if( canvasObject.getObjects().length > 1 && 
	    canvasObject.canvasView === 'front' )
	{
		$.alerts.okButton = '&nbsp;Evet&nbsp;';
		$.alerts.cancelButton = '&nbsp;Hayır&nbsp;';
		jConfirm( 'Beta Sürümünde Kıyafetlerin Arkadan Görünümü Mevcut Değil.<br>Kıyafetler Döndürülmeyecek. Devam Etmek İstiyor musunuz?', 'Mankeni Döndür', function( answer ) 
		{    			
			if( answer )
			{				
				canvasObject.removeAllCloths();
				canvasObject.rotateView();				
			}			
		} );
	}
	else
	{
		canvasObject.rotateView();
	}
}

function bindModelCanvasButtons( modelCanvasAreaId, canvasObject )
{		
	$( modelCanvasAreaId + " > .modelCanvasNavigationButtons > img.canvasButton.canvasUndo" ).unbind( 'click' ).bind( 'click', { canvasObject: canvasObject }, function( e )
	{
		modelCanvasUndo( e.data.canvasObject );
	} );
	$( modelCanvasAreaId + " > .modelCanvasNavigationButtons > img.canvasButton.canvasRedo" ).unbind( 'click' ).bind( 'click', { canvasObject: canvasObject }, function( e )
	{
		modelCanvasRedo( e.data.canvasObject );
	} );
	$( modelCanvasAreaId + " > .modelCanvasNavigationButtons > img.canvasButton.canvasDressingRoom" ).unbind( 'click' ).bind( 'click', { canvasObject: canvasObject }, function( e )
	{
		$.alerts.okButton = '&nbsp;Evet&nbsp;';
		$.alerts.cancelButton = '&nbsp;Hayır&nbsp;';
		jConfirm( 'Varolan tasarımı kapatıp seçili tasarımı yüklemek istiyor musunuz?<br>' + 
				  'Aktif tasarımdaki kaydedilmemiş değişiklikler kaybolacaktır!', 'Podyuma Aktar', function( answer ) 
		{    			
			if( answer )
			{									
				var creationKey = $( "#creationsModelCloths > .modelClothsList > .modelClothsListName > textarea" ).attr( "listId" );
				dressingRoomCanvas.clear();
				dressingRoomCanvas.load( creationKey, JSON.parse( localStorage.getItem( creationKey ) ) );
				$( "#leftNavigationList > li.leftNavigationItem#dressingRoomNavItem > a" ).trigger( "click" );
			}
		} );						
	} );
	$( modelCanvasAreaId + " > .modelCanvasViewButtons > img.canvasButton.canvasRotate" ).unbind( 'click' ).bind( 'click', { canvasObject: canvasObject }, function( e )
	{
		modelCanvasRotate( e.data.canvasObject );
	} );
}

// canvas button active - inactive change
$( ".modelCanvasArea > .modelCanvasNavigationButtons > img.canvasButton.canvasUndo" ).hover(
	function() { $( this ).attr( "src", "images/canvas_undo_active.png" ) },
	function() { $( this ).attr( "src", "images/canvas_undo_inactive.png" ) } );
$( ".modelCanvasArea > .modelCanvasNavigationButtons > img.canvasButton.canvasRedo" ).hover(
	function() { $( this ).attr( "src", "images/canvas_redo_active.png" ) },
	function() { $( this ).attr( "src", "images/canvas_redo_inactive.png" ) } );
$( ".modelCanvasArea > .modelCanvasNavigationButtons > img.canvasButton.canvasDressingRoom" ).hover(
	function() { $( this ).attr( "src", "images/canvas_dressingroom_active.png" ) },
	function() { $( this ).attr( "src", "images/canvas_dressingroom_inactive.png" ) } );
$( ".modelCanvasArea > .modelCanvasViewButtons > img.canvasRotate" ).hover(
	function() { $( this ).attr( "src", "images/canvas_rotate_active.png" ) },
	function() { $( this ).attr( "src", "images/canvas_rotate_inactive.png" ) } );
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Canvas Area Functions - Used By DressingRoom and Creations
////////////////////////////////////////////////////////////////////////////////////////////////////////	



////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creation Catalog Functions - Creations View
////////////////////////////////////////////////////////////////////////////////////////////////////////
function getStoredCreationsList()
{
	// find stored creations key
	var storedCreationsKeyList = [];
	var storedItemsSize = localStorage.length;
	for( var i = 0; i < storedItemsSize; i++ )
	{
		var key = localStorage.key( i );
		if( key.indexOf( "hipmoni-creation-" ) >= 0 )
		{
			storedCreationsKeyList.push( key );
		}
	}
	
	return storedCreationsKeyList;
}

function updateCreationsList()
{
	// start processing
	startProcessing();
	
	// get stored creations
	storedCreationsKeyList = getStoredCreationsList();
	
	// call update catalog menu function
	updateCatalogMenu( $( "#creationCatalog" ), storedCreationsKeyList, createCreationItem, updateCreationCatalogStatus ); 
	
	// stop processing
	stopProcessing();
}
	
function createCreationItem( catalogListItemTableColumn, creationKey )
{					
	// get local storage
	var storedCreation = JSON.parse( localStorage.getItem( creationKey ) );
	
	// add attribute
	catalogListItemTableColumn.attr( "creationId", creationKey );

	// update column item
	catalogListItemTableColumn.unbind( 'click' ).bind( 'click', { canvasObject: creationsCanvas, saveObject: storedCreation }, function( e ) 
	{ 
		if ( e.which == 1 ) 
		{ 
			// see if same thumb is being clicked
			if( $( this ).hasClass( "active" ) ) { return; }

			// start processing
			startProcessing();						
			
			// show comments
			$( "#creationsReviewPanelWrapper > #creationsReviewPanel" ).show();
			$( "#creationsReviewPanelWrapper > #creationsReviewPanel > .reviewPanelReviews" ).tinyscrollbar_update();
			
			// load canvas
			e.data.canvasObject.load( creationKey, e.data.saveObject ); 
			
			// update active list item
			updateCreationCatalogStatus();
			
			// stop processing
			stopProcessing();	
		} 
	} );	
	
	// create main div
	var creationCatalogItem = $( document.createElement( 'div' ) );
	creationCatalogItem.addClass( "creationCatalogItem" );
	creationCatalogItem.addClass( "catalogMenuItem" );
	catalogListItemTableColumn.append( creationCatalogItem );
	
	// create creation information div
	var creationCatalogItemInformation = $( document.createElement( 'div' ) );
	creationCatalogItemInformation.addClass( "creationCatalogItemInformation" );
	creationCatalogItem.append( creationCatalogItemInformation );
	
	// create creation name span
	var creationCatalogItemName = $( document.createElement( 'span' ) );
	creationCatalogItemName.text( storedCreation.name );
	creationCatalogItemInformation.append( creationCatalogItemName );
		
	// create creation image div
	var creationCatalogItemImage = $( document.createElement( 'div' ) );
	creationCatalogItemImage.addClass( "creationCatalogItemImage" );
	creationCatalogItem.append( creationCatalogItemImage );	
		
	// create image inner div
	var creationCatalogItemImageInnerDiv = $( document.createElement( 'div' ) );
	creationCatalogItemImage.append( creationCatalogItemImageInnerDiv );
	
	// create image
	var creationCatalogItemImageObject = $( document.createElement( 'img' ) );
	creationCatalogItemImageObject.attr( "src", storedCreation.snapshot );
	creationCatalogItemImageInnerDiv.append( creationCatalogItemImageObject );
	
	// create social div
	var creationCatalogItemSocial = $( document.createElement( 'div' ) );
	creationCatalogItemSocial.addClass( "creationCatalogItemSocial" );
	creationCatalogItem.append( creationCatalogItemSocial );
	
	// create facebook div
	var creationCatalogItemSocialFacebook = $( document.createElement( 'div' ) );
	creationCatalogItemSocialFacebook.addClass( "creationCatalogItemSocialItem" );
	creationCatalogItemSocialFacebook.addClass( "creationCatalogItemSocialFacebook" );
	creationCatalogItemSocial.append( creationCatalogItemSocialFacebook );
	
	// create facebook image
	var creationCatalogItemSocialFacebookImage = $( document.createElement( 'img' ) );
	creationCatalogItemSocialFacebookImage.attr( "src", "images/social/facebook.png" );
	creationCatalogItemSocialFacebook.append( creationCatalogItemSocialFacebookImage );
	
	// create facebook count
	var creationCatalogItemSocialFacebookCount = $( document.createElement( 'div' ) );
	creationCatalogItemSocialFacebookCount.addClass( "creationCatalogItemSocialItemCount" );
	creationCatalogItemSocialFacebookCount.text( Math.floor( ( Math.random() * 100 ) + 1 ) );
	creationCatalogItemSocialFacebook.append( creationCatalogItemSocialFacebookCount );
	
	// create twitter div
	var creationCatalogItemSocialTwitter = $( document.createElement( 'div' ) );
	creationCatalogItemSocialTwitter.addClass( "creationCatalogItemSocialItem" );
	creationCatalogItemSocialTwitter.addClass( "creationCatalogItemSocialTwitter" );
	creationCatalogItemSocial.append( creationCatalogItemSocialTwitter );
	
	// create twitter image
	var creationCatalogItemSocialTwitterImage = $( document.createElement( 'img' ) );
	creationCatalogItemSocialTwitterImage.attr( "src", "images/social/twitter.png" );
	creationCatalogItemSocialTwitter.append( creationCatalogItemSocialTwitterImage );
	
	// create twitter count
	var creationCatalogItemSocialTwitterCount = $( document.createElement( 'div' ) );
	creationCatalogItemSocialTwitterCount.addClass( "creationCatalogItemSocialItemCount" );
	creationCatalogItemSocialTwitterCount.text( Math.floor( ( Math.random() * 100 ) + 1 ) );
	creationCatalogItemSocialTwitter.append( creationCatalogItemSocialTwitterCount );
	
	// create google plus div
	var creationCatalogItemSocialGooglePlus = $( document.createElement( 'div' ) );
	creationCatalogItemSocialGooglePlus.addClass( "creationCatalogItemSocialItem" );
	creationCatalogItemSocialGooglePlus.addClass( "creationCatalogItemSocialGooglePlus" );
	creationCatalogItemSocial.append( creationCatalogItemSocialGooglePlus );
	
	// create google plus image
	var creationCatalogItemSocialGooglePlusImage = $( document.createElement( 'img' ) );
	creationCatalogItemSocialGooglePlusImage.attr( "src", "images/social/googleplus.png" );
	creationCatalogItemSocialGooglePlus.append( creationCatalogItemSocialGooglePlusImage );
	
	// create google plus count
	var creationCatalogItemSocialGooglePlusCount = $( document.createElement( 'div' ) );
	creationCatalogItemSocialGooglePlusCount.addClass( "creationCatalogItemSocialItemCount" );
	creationCatalogItemSocialGooglePlusCount.text( Math.floor( ( Math.random() * 100 ) + 1 ) );
	creationCatalogItemSocialGooglePlus.append( creationCatalogItemSocialGooglePlusCount );
	
	// create pinterest div
	var creationCatalogItemSocialPinterest = $( document.createElement( 'div' ) );
	creationCatalogItemSocialPinterest.addClass( "creationCatalogItemSocialItem" );
	creationCatalogItemSocialPinterest.addClass( "creationCatalogItemSocialPinterest" );
	creationCatalogItemSocial.append( creationCatalogItemSocialPinterest );
	
	// create pinterest image
	var creationCatalogItemSocialPinterestImage = $( document.createElement( 'img' ) );
	creationCatalogItemSocialPinterestImage.attr( "src", "images/social/pinterest.png" );
	creationCatalogItemSocialPinterest.append( creationCatalogItemSocialPinterestImage );
	
	// create pinterest count
	var creationCatalogItemSocialPinterestCount = $( document.createElement( 'div' ) );
	creationCatalogItemSocialPinterestCount.addClass( "creationCatalogItemSocialItemCount" );
	creationCatalogItemSocialPinterestCount.text( Math.floor( ( Math.random() * 100 ) + 1 ) );
	creationCatalogItemSocialPinterest.append( creationCatalogItemSocialPinterestCount );	
		
	// delete button image
	var creationCatalogItemDeleteButton = $( document.createElement( 'img' ) );
	creationCatalogItemDeleteButton.attr( "src", "images/deleteIcon.png" );
	creationCatalogItemDeleteButton.addClass( "deleteItem" );
	creationCatalogItemDeleteButton.unbind( "click" ).bind( 'click', { creationId: creationKey }, function( e ) 
	{ 
		if ( e.which == 1 ) 
		{			
			$.alerts.okButton = '&nbsp;Evet&nbsp;';
			$.alerts.cancelButton = '&nbsp;Hayır&nbsp;';
			jConfirm( 'Bu kayıdı silmek istiyor musunuz?', 'Kayıt Silme', function( answer ) 
			{    			
				if( answer )
				{					
					localStorage.removeItem( e.data.creationId ); 
					updateCreationsList(); 
				}
			} );	
			return false;					
		} 
	} );
	creationCatalogItem.append( creationCatalogItemDeleteButton );
	
	// privacy settings
	var creationCatalogItemPrivacySettings = $( document.createElement( 'div' ) );
	creationCatalogItemPrivacySettings.addClass( "creationCatalogItemPrivacySettings" );
	creationCatalogItemPrivacySettings.html( "Stilin Gizliliği:<br>																													\
		<input id=\"privacy_visible_all\" type=\"radio\" name=\"privacyOption\" value=\"visible_all\" checked/><label for=\"privacy_visible_all\"> Herkese Açık</label></br>		\
		<input id=\"privacy_visible_friends\" type=\"radio\" name=\"privacyOption\" value=\"visible_friends\" /> <label for=\"privacy_visible_friends\"> Sadece Takipçiler</label></br>	\
		<input id=\"privacy_visible_me\" type=\"radio\" name=\"privacyOption\" value=\"visible_me\" /><label for=\"privacy_visible_me\"> Sadece Ben</label></br>" );
	creationCatalogItemPrivacySettings.unbind( "click" ).bind( 'click', function( e ) 
	{ 
		if ( e.which == 1 ) 
		{			
			e.stopPropagation();								
		} 
	} );

	creationCatalogItem.append( creationCatalogItemPrivacySettings );
	creationCatalogItemPrivacySettings.hide();
	
	// privacy button
	var creationCatalogItemPrivacyButton = $( document.createElement( 'img' ) );
	creationCatalogItemPrivacyButton.attr( "src", "images/privacyIcon.png" );
	creationCatalogItemPrivacyButton.addClass( "privacyIcon" );
	creationCatalogItemPrivacyButton.unbind( "click" ).bind( 'click', { privacySettings: creationCatalogItemPrivacySettings }, function( e ) 
	{ 
		if ( e.which == 1 ) 
		{			
			// toggle privacy settings
			e.data.privacySettings.toggle( 500 );
			return false;								
		} 
	} );
	creationCatalogItem.append( creationCatalogItemPrivacyButton );
}

function updateCreationCatalogStatus()
{
	// clear all worn attributes
	$( "#creationCatalog > #creationCatalogList table.catalogMenuListItemTable > tbody > tr > td" ).removeClass( "active" );
	
	// add active attribute
	$( "#creationCatalog > #creationCatalogList table.catalogMenuListItemTable > tbody > tr > td[creationId=" + 
		$( "#creationsModelCloths > .modelClothsList > .modelClothsListName > textarea" ).attr( "listId" ) + "]" ).addClass( "active" );
}

$( ".reviewPanel > .reviewPanelHeader > div.newReview" ).unbind( "click" ).bind( 'click', function( e )
{
	// create a comment write area		
	$( this ).parent().siblings( ".reviewPanelNewReview" ).show();
	if( ! $( this ).parent().siblings( ".reviewPanelNewReview" ).children( ".reviewTextArea" ).hasClass( "autosize" ) )
	{
		$( this ).parent().siblings( ".reviewPanelNewReview" ).children( ".reviewTextArea" ).autosize();
		$( this ).parent().siblings( ".reviewPanelNewReview" ).children( ".reviewTextArea" ).addClass( "autosize" );
	}
} );

$( ".reviewPanel > .reviewPanelNewReview > .cancelReview" ).unbind( "click" ).bind( 'click', function( e )
{
	$( this ).siblings( ".reviewTextArea" ).val( "" );
	$( this ).parent().hide();		
} );

$( ".reviewPanel > .reviewPanelNewReview > .sendReview" ).unbind( "click" ).bind( 'click', function( e )
{
	// create new review item
	var currentTime = new Date();
	var currentTimeString = currentTime.toLocaleTimeString() + " " + leadingZero( currentTime.getDate()) + "." + leadingZero( currentTime.getMonth() + 1 ) + "." + currentTime.getFullYear();
	var newReviewItem = $( document.createElement( 'li' ) );
	newReviewItem.addClass( "reviewListItem" );
	newReviewItem.html(
		"<div class=\"reviewItem\">																													\
			<div class=\"reviewItemUserImage\"><img src=\"images/user.png\" /></div> 																\
		 	<div class=\"reviewItemText\">																											\
				<div class=\"reviewItemUpper clearfix\">																							\
					<div class=\"reviewItemUserName\">Paris Hilton</div>																			\
					<div class=\"reviewItemDate\">" + currentTimeString + "</div>																	\
				</div>																																\
				<div class=\"reviewItemMessage\">" + $( this ).siblings( ".reviewTextArea" ).val().replace( /\n/g,"</br>" ) + "</div>				\
		 	</div>																																	\
		</div>" );
	
	$( this ).parent().siblings( ".reviewPanelReviews" ).find( "ul.reviewList" ).children( "li:first" ).before( newReviewItem );		
	$( this ).siblings( ".reviewTextArea" ).val( "" );
	$( this ).parent().hide();		
	if( $( this ).parent().siblings( ".reviewPanelReviews.tinyScrollBar" ).length > 0 )
	{
		$( this ).parent().siblings( ".reviewPanelReviews.tinyScrollBar" ).tinyscrollbar_update();
	}
	$( "#circlesWall" ).tinyscrollbar_update( 'relative' );		
} );

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creation Catalog Functions - Creations View
////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////
// Circles Canvas Functions - Circles View
////////////////////////////////////////////////////////////////////////////////////////////////////////
$( "#circles" ).unbind( "object:select" ).bind( "object:select", function()
{	
	circleCanvas1.calcOffset();	
	circleCanvas2.calcOffset();
	
	var Image1 = $( "#circlesWallItem1ExpandableSmallViewImage" );
	if( Image1.attr( "src" ).length <= 0 )
	{
		Image1.attr( "src", circleCanvas1.toDataURLWithMultiplier( "jpg", 0.50 ) );
	}
	
	var Image2 = $( "#circlesWallItem2ExpandableSmallViewImage" );
	if( Image2.attr( "src" ).length <= 0 )
	{
		Image2.attr( "src", circleCanvas2.toDataURLWithMultiplier( "jpg", 0.50 ) );
	}
	
	$( "#circlesWall" ).tinyscrollbar_update( 'relative' );
} );
$( "#circles" ).unbind( "object:deselect" ).bind( "object:deselect", function()
{
	circleCanvas1.objectNoHover();
	circleCanvas1.objectNoSelection();
	circleCanvas2.objectNoHover();
	circleCanvas2.objectNoSelection();
} );

$( "#circlesWall .circlesWallItem > .circlesWallItemRight > .circlesWallItemInformation > .circlesWallItemModelExpand" ).click( function(e) 
{
	$( this ).parent().siblings( ".circlesWallItemExpandableSmallView" ).toggle( 1000, function() 
	{ 
		$( "#circlesWall" ).tinyscrollbar_update( 'relative' ); 		
	} );	
	$( this ).parent().siblings( ".circlesWallItemExpandableLargeView" ).toggle( 1000, function() 
	{ 
		$( "#circlesWall" ).tinyscrollbar_update( 'relative' ); 		
	} );	
	
	if( $( this ).children( "h2" ).text() == "Stili Göster" )
	{
		$( this ).children( "h2" ).text( "Stili Sakla" );
	}
	else
	{
		$( this ).children( "h2" ).text( "Stili Göster" );
	}
} );

$( "#profile" ).unbind( "object:select" ).bind( "object:select", function()
{	
	$( "#profileDetail > div.profilePhotoList > div.profilePhotoListScrollable" ).each( function(index, element) {
        $( element ).tinyscrollbar_update();
    }); 
	setTimeout( "$( \'#profileDetail > div.profilePhotoList > div.profilePhotoListScrollable\' ).each( function(index, element) { $( element ).tinyscrollbar_update(); } )", 500 );
} );
$( "#profile" ).unbind( "object:deselect" ).bind( "object:deselect", function()
{
} );

$( "#basket" ).unbind( "object:select" ).bind( "object:select", function()
{	
	updateBasket();	
} );
$( "#basket" ).unbind( "object:deselect" ).bind( "object:deselect", function()
{
} );


////////////////////////////////////////////////////////////////////////////////////////////////////////
// Basket View
////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateBasket()
{
	var Total = 0.0;
	var ItemCount = 0;
	
	$( "#basketTable tr > td.basketTableItemTotal" ).each( function( index, element) 
	{
        ItemCount++;
		Total += parseFloat( $( element ).children( "span.optionPrice" ).text() );
    });
	
	$( "#basketTable tr.basketTableTotal > td.basketTableTotalPrice > span.basketTableTotalPriceAmount" ).text( Total.toFixed( 2 ) );

	if( ItemCount < 1 )
	{		
		$( "#noItemInBasket" ).show();
		$( "#basketTable" ).hide();
	}
	else
	{		
		$( "#noItemInBasket" ).hide();
		$( "#basketTable" ).show();
	}
	
	$( "#basketScrollable" ).tinyscrollbar_update();
	setTimeout( "$( \'#basketScrollable\' ).tinyscrollbar_update()", 500 );
}
