// Cloth object
function Cloth( clothId, price, categoryId, brand, clothColors, defaultColor, clothSizes, defaultSize ) 
{
	this.clothId = clothId;
	this.price = price;
	this.categoryId = categoryId;
	this.brand = brand;
	this.clothColors = clothColors;	
	this.defaultColor = defaultColor;	
	this.clothSizes = clothSizes;	
	this.defaultSize = defaultSize;	
}

// Cloth Color Object
function ClothColor( colorId, colorName, colorCode, frontView, backView )
{
	this.colorId = colorId;
    this.colorName = colorName;
	this.colorCode = colorCode;
	this.views.frontView = frontView;
	this.views.backView = backView;
}

// Cloth Size Object
function ClothSize( sizeId, sizeName )
{
	this.sizeId = sizeId;
    this.sizeName = sizeName;
}

// Cloth View Object
function ClothView( clothURL, clothPositionX, clothPositionY )
{
	this.clothURL = clothURL;
	this.clothPositionX = clothPositionX;
	this.clothPositionY = clothPositionY;
}

// Cloth Catalogue Cache
var ClothCatalogue = {};

// Get Cloth
function getCloth( clothId )
{
	return ClothCatalogue[ clothId ];
}

// Canvas Cloth Object - Extends Canvas Object
var CanvasCloth = fabric.util.createClass( fabric.Object, fabric.Observable,
{
    H_PADDING: 0,
  	V_PADDING: 0,
	initialize: function( clothId, canvasView, options ) 
	{				
		// own settings
		this.clothId = clothId;
		this.canvasView = canvasView;
		this.selectedColor = getCloth( this.clothId ).defaultColor;
		this.selectedSize = getCloth( this.clothId ).defaultSize;
		this.image = null;
		
		// fabric js settings
		this.callSuper( 'initialize', options );
		this.lockRotation = true;
		this.lockScalingX = true;
		this.lockScalingY = true;
		this.lockMovementX = true;
		this.lockMovementY = true;
		this.hasControls = false;
		this.hasBorders = false;
	},
	updateImage: function()
	{
		this.image = new Image(); 			
		this.image.onload = ( function() 
		{  		
			this.width = this.image.width;
			this.height = this.image.height;
			this.loaded = true;
			var activeView = this.getActiveView();
			this.setOptions( { left: activeView.clothPositionX, top: activeView.clothPositionY, angle: 0 } );
			this.setCoords();
			this.fire( 'image:loaded' );
		} ).bind( this );
		this.image.src = this.getCanvasURL(); 
	},
	getActiveColor: function() 
	{ 
		return getCloth( this.clothId ).clothColors[ this.selectedColor ]; 
	},	
	getActiveView: function() 
	{ 
		return this.getActiveColor().views[ this.canvasView ]; 
	},
	getCanvasURL: function() 
	{
		return "images/catalogItems/" + getCloth( this.clothId ).categoryId + "/" + this.clothId + "/" + this.selectedColor + "/" + this.canvasView + ".png";
	},
	getActiveSize: function() 
	{ 
		return getCloth( this.clothId ).clothSizes[ this.selectedSize ]; 
	},
	_render: function( ctx ) 
	{
		if( this.loaded ) 
		{
		  	ctx.fillStyle = 'rgba( 255, 255, 255, 0.0 )';
		  	ctx.fillRect( -( this.width / 2 ), -( this.height / 2 ), this.width, this.height );
		  	ctx.drawImage( this.image, -this.width / 2, -this.height / 2 );			
		}
  	},
	toObject: function()
	{
		return fabric.util.object.extend( this.callSuper( 'toObject' ), 
		{ 
  			clothId: this.clothId
		} );
	},
} );

// Product Catagory Object
function ProductCategory( categoryId, categoryName, renderOrder, clothList )
{
	this.categoryId = categoryId;
    this.categoryName = categoryName;
	this.renderOrder = renderOrder;
	this.clothList = clothList;
}

function ProductMainCategory( categoryId, categoryName, subcategoryList )
{
	this.categoryId = categoryId;
    this.categoryName = categoryName;
	this.subcategoryList = subcategoryList;
}

// Product Categories and Main Categories
var ProductCategories = {};
var ProductMainCategories = {};

// Get Product Category 
function getProductCategory( categoryId )
{
	return ProductCategories[ categoryId ];
}

// Get Product Main Category 
function getProductMainCategory( categoryId )
{
	return ProductMainCategories[ categoryId ];
}

// Get Products
function getClothes( categoryId )
{
	var productList = [];
	// try to get from leaf category
	var productCategory = getProductCategory( categoryId );
	if( productCategory != null )
	{
		productList.push.apply( productList, productCategory.clothList );
	}
	else
	{
		productCategory = getProductMainCategory( categoryId );
		if( productCategory != null )
		{
			productCategory.subcategoryList.map( function( item ) 
			{
				var subproductList = getClothes( item );
				productList.push.apply( productList, subproductList );
			} );
		}	
	}
	
	return productList;
}
