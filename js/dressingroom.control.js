/*
 * Canvas functions
 */
// Global Variables
var dressingRoomCanvas = null;
var creationsCanvas = null;

// Prepare Canvas
function prepareCanvas()
{
	// add new methods
	fabric.util.object.extend( fabric.StaticCanvas.prototype, 
	{
		// model Image object - initial null
		modelImage: null,
		// canvas view - etiher front or back. Initial front
		canvasView: 'front',
		// internal selection and hover object targets
		hoveredObject: null,
		selectedObject: null,
		// speacial object - drawn differently
		specialObject: null,
		// swap two objects in canvas
		swapObjects: function( first_object, second_object )
		{
			var objects = this.getObjects();
			var first_pos = objects.indexOf( first_object );
			var second_pos = objects.indexOf( second_object );
			var temp_object = objects[ second_pos ];
			objects[ second_pos ] = objects[ first_pos ];
			objects[ first_pos ] = temp_object;	
			this.renderAll();		
		},
		// change model
		changeModel: function( gender, modelId )
		{
			// model name
			var modelFileName = "images/models/" + gender + "/" + modelId + "/" + this.canvasView + "/canvas.png";
			
			if( this.modelImage === null )
			{
				var canvasObject = this;
				
				fabric.Image.fromURL( modelFileName, function( img ) 
				{
					img.set( { left: canvasObject.width / 2, top: canvasObject.height / 2, angle: 0 } );
					img.lockRotation = true;
					img.lockScalingX = true;
					img.lockScalingY = true;
					img.lockMovementX = true;
					img.lockMovementY = true;
					img.hasControls = false;
					img.hasBorders = false;		
					img.selectable = false;		
					canvasObject.modelImage = img;
					canvasObject.modelImage.gender = gender;
					canvasObject.modelImage.modelId = modelId;
					canvasObject.add( canvasObject.modelImage );						
					canvasObject.sendToBack( canvasObject.modelImage );									
				}); 
			}
			else
			{	
				var canvasObject = this;
				
				var newImage = new Image(); 
				newImage.onload = function() 
				{  		
					canvasObject.modelImage.setElement( newImage );					
					canvasObject.modelImage.gender = gender;
					canvasObject.modelImage.modelId = modelId;
					canvasObject.sendToBack( canvasObject.modelImage );
				}; 
				newImage.src = modelFileName; 
			}
		},
		// update find target method - tobe used for hover
		updateFindTarget: function()
		{
			// piggyback on `dressingRoomCanvas.findTarget`, to fire "object:over" and "object:out" events
			this.findTarget = ( function( originalFn ) 
			{
				return function() 
				{
					var target = originalFn.apply( this, arguments );
					if( target )
					{				
						this.fire( 'hover:object', { e: arguments[ 0 ], target: target } );						  		
					}
					else
					{		  		
						this.fire( 'hover:no' );		  		
					}
					
					return target;
				};
			} )( this.findTarget );
		},
		// change background
		changeBackground: function( backgroundName )
		{
			// background filename
			var backgroundImageName = "images/backgrounds/" + backgroundName + "/background.png";
			var canvasObject = this;
			this.setBackgroundImage( backgroundImageName, function() { canvasObject.redraw(); canvasObject.backgroundName = backgroundName; } );	
		},
		// change view of canvas
		changeView: function( newView )
		{
			if( this.canvasView !== newView )
			{
				this.canvasView = newView;
				// update model
				this.changeModel( this.modelImage.gender, this.modelImage.modelId );
				// update all cloths				
				this.forEachObject( function( obj ) 
				{
					if( obj instanceof CanvasCloth )
					{
						obj.canvasView = this.canvasView;
						obj.updateImage();
					}
				} );
			}
		},
		// rotate view of canvas
		rotateView: function( )
		{
			if( this.canvasView === 'front' )
			{
				this.changeView( 'back' );
			}
			else
			{
				this.changeView( 'front' );
			}
		},
		// hover function
		objectHover: function( cursorInfo, hoveredObject ) 
		{
			// check is there a selection. If yes hover is not active
			if( this.selectedObject === null )
			{		
				// check there is previously hovered object exists and hover is different or same
				if( this.hoveredObject !== hoveredObject )
				{
					this.fire( 'cloth:hover:new', { cursorInfo: cursorInfo, clothId: hoveredObject.clothId, canvas: this } );
				}
				else
				{
					this.fire( 'cloth:hover:same', { cursorInfo: cursorInfo, clothId: hoveredObject.clothId, canvas: this } );
				}
				this.fire( 'cloth:hover', { cursorInfo: cursorInfo, clothId: hoveredObject.clothId, canvas: this } );				
				
				this.hoveredObject = hoveredObject;
				this.redraw( this.hoveredObject );
			}			
		},
		// no hover function
		objectNoHover: function() 
		{		
			// check is there a hovered target
			if( this.hoveredObject !== null )
			{				
				this.fire( 'cloth:hover:end', { canvas: this } );							
				this.hoveredObject = null;	
				this.redraw();	
			}
		},
		// object selection
		objectSelect: function( cursorInfo, selectedObject )
		{
			// cancel hover
			this.objectNoHover();
			
			// activate selection
			// check there is previously selected object exists and selected object is different or same
			if( this.selectedObject !== selectedObject )
			{
				this.fire( 'cloth:select:new', { cursorInfo: cursorInfo, clothId: selectedObject.clothId, canvas: this } );	
			}
			else
			{
				this.fire( 'cloth:select:same', { cursorInfo: cursorInfo, clothId: selectedObject.clothId, canvas: this } );
			}
			this.fire( 'cloth:select', { cursorInfo: cursorInfo, clothId: selectedObject.clothId, canvas: this } );
						
			this.selectedObject = selectedObject;	
			this.redraw( this.selectedObject );			
		},
		// no object selected
		objectNoSelection: function()
		{		
			// check selected object exists
			if( this.selectedObject !== null )
			{		
				this.fire( 'cloth:select:end', { canvas: this } );
				this.selectedObject = null;		
				this.redraw();				
			}		
		},
		// Get Cloths Below and Over
		getClothsBelow: function( clothId )
		{
			var clothsBelow = new Array();
			var selectedObject = this.findObject( "clothId", clothId );
			var objects = this.getObjects();
			var length = objects.length;
			var selectedElementPosition = objects.indexOf( selectedObject );
			// check objects below
			for( var i = 0; i < selectedElementPosition; i++ )
			{
				// get object
				var obj = objects[ i ];
				if( ( obj instanceof CanvasCloth ) &&
					( selectedObject.isContainedWithinObject( obj ) || obj.isContainedWithinObject( selectedObject ) || 
					  selectedObject.intersectsWithObject( obj ) || selectedObject.intersectsWithObject( obj ) ) )
				{
					clothsBelow.push( obj.clothId );
				}
			}
			
			return clothsBelow;
		},
		getClothsOver: function( clothId )
		{
			var clothsOver = new Array();
			var selectedObject = this.findObject( "clothId", clothId );
			var objects = this.getObjects();
			var length = objects.length;
			var selectedElementPosition = objects.indexOf( selectedObject );
			// check objects over				
			for( var i = ( selectedElementPosition + 1 ); i < length; i++ )
			{
				// get object
				var obj = objects[ i ];
				if( ( obj instanceof CanvasCloth ) &&
					( selectedObject.isContainedWithinObject( obj ) || obj.isContainedWithinObject( selectedObject ) || 
					  selectedObject.intersectsWithObject( obj ) || selectedObject.intersectsWithObject( obj ) ) )
				{
					clothsOver.push( obj.clothId );
				}
			}
			
			return clothsOver;	
		},
		// redraw function
		redraw: function( specialObject )
		{				
			if( specialObject && this.getObjects().indexOf( specialObject ) >= 0 )
			{				
				this.forEachObject( function( obj ) 
				{
					obj.setOpacity( 0.25 );		
				} );
				
				// change opacity
				this.specialObject = specialObject;
				specialObject.setOpacity( 1.0 );						
			}
			else
			{
				this.forEachObject( function( obj ) 
				{
					obj.setOpacity( 1.0 );			
				} );
				
				this.specialObject = null;
			}	
			
			this.renderAll();
		},
		// special draw function - renders special object 
		specialDraw: function()
		{
			if( this.specialObject !== null )
			{
				this.specialObject.render( this[ 'contextContainer' ] );
			}
		},
		// update cloth - wears if not worn. If worn, removes cloth
		updateCloth: function( clothId )
		{
			// cancel selection and hover
			this.objectNoHover();
			this.objectNoSelection();
			
			// decide cloth is to be worn or removed according to existence on canvas
			var canvasObject = this.findObject( "clothId", clothId );
			if( canvasObject === null )
			{
				if( this.canvasView === 'back' )
				{
					$.alerts.okButton = '&nbsp;Tamam&nbsp;';
					jAlert( "Beta versiyonunda arkadan görünüm için kıyafetler giydirilememektedir", "Uyarı" );
					return;
				}
				
				canvasObject = new CanvasCloth( clothId, this.canvasView );
				canvasObject.observe( 'image:loaded', this.redraw.bind( this ) );
				canvasObject.updateImage();
				this.addCloth( canvasObject );								
			}
			else
			{
				this.removeCloth( canvasObject );								
			}								
		},
		// add clothing
		addCloth: function( clothObject )
		{
			// add to canvas cloth list
			var newObjectRenderOrder = getProductCategory( getCloth( clothObject.clothId ).categoryId ).renderOrder;
			var posToInsert;
			var objects = this.getObjects();
			var length = objects.length;
			for( posToInsert = ( length - 1 ); posToInsert >= 0; posToInsert-- )
			{
				// get object check first it is canvas cloth object and then check render order
				var canvasObject = objects[ posToInsert ];
				if( ! ( canvasObject instanceof CanvasCloth ) ||
					( getProductCategory( getCloth( canvasObject.clothId ).categoryId ).renderOrder < newObjectRenderOrder ) ) break;
			}
			
			this.insertAt( clothObject, posToInsert + 1, false );
			this.fire( "cloth:update:wear", { clothId: clothObject.clothId, canvas: this } );
			this.fire( "cloth:update", { clothId: clothObject.clothId, canvas: this } );					
		},		
		// remove clothing
		removeCloth: function( clothObject )
		{
			// remove object
			this.remove( clothObject );
			this.fire( "cloth:update:remove", { clothId: clothObject.clothId, canvas: this } );
			this.fire( "cloth:update", { clothId: clothObject.clothId, canvas: this } );						
		},
		// remove all clothing
		removeAllCloths: function()
		{
			// cancel selection and hover
			this.objectNoHover();
			this.objectNoSelection();
			
			var canvas = this;
			this.forEachObject( function( obj ) 
			{
				if( obj instanceof CanvasCloth )
				{
					canvas.removeCloth( obj );
				}
			} );
		},
		// save canvas
		save: function( storageName, saveName )
		{
			// create save object
			var saveObject = new Object();	
			saveObject.name = saveName;
			saveObject.model = { gender: this.modelImage.gender, id: this.modelImage.modelId };
			saveObject.snapshot = this.toDataURLWithMultiplier( "png", 0.36 );
			saveObject.background = this.backgroundName;
			
			// get cloth array
			var clothArray = [];
			var objects = this.getObjects();
			var length = objects.length;
			for( i = 0; i < length; i++ )
			{
				if( objects[ i ] instanceof CanvasCloth )
				{
					clothArray.push( objects[ i ].clothId );
				}
			}
			saveObject.cloths = clothArray;	
			
			// save date time
			var now = new Date();
			var day = now.getDate();
			var month = ( now.getMonth() + 1 );
			var hour = now.getHours();
			var minute = now.getMinutes();
			saveObject.recordTime = ( ( day < 10 ? "0" : "" ) + day + "." + 
									  ( month < 10 ? "0" : "" ) + month + "." + 
									   now.getFullYear() + " " + 
									  ( hour < 10 ? "0" : "" ) + hour + ":" + 
									  ( minute < 10 ? "0" : "" ) + minute );
			
			localStorage.setItem( storageName, JSON.stringify( saveObject ) );			
			this.fire( "canvas:save", { storageName: storageName, canvas: this } );
		},
		// load canvas
		load: function( saveObjectName, saveObject )
		{			
			if( saveObject !== null )
			{
				// clear canvas
				this.clear();
				
				// change background
				if( saveObject.background )
				{
					this.changeBackground( saveObject.background );
				}
				
				// change model	
				this.changeModel( saveObject.model.gender, saveObject.model.id );
										
				// update clothes
				var length = saveObject.cloths.length;
				for( i = 0; i < length; i++ )
				{
					this.updateCloth( saveObject.cloths[ i ] );
				}
				
				this.fire( "canvas:load", { storageName: saveObjectName, saveObject: saveObject, canvas: this } );
			}
		},
		// find object
		findObject: function( attributeName, attributeValue )
		{
			var parts = attributeName.split( '.' );
			var objects	= this.getObjects();
			for( var i = 0; i < objects.length; i++ )
			{
				var object = objects[ i ];
				var found = true;
				for( var j = 0; found && j < parts.length; j++ ) 
				{
					var part = parts[ j ];
					if( object !== null && typeof object === "object" && part in object ) 
					{
						object = object[ part ];
					}
					else 
					{
						found = false;
					}
				}
				
				if( found && object === attributeValue )
				{
					return objects[ i ];
				}
			}
			
			// cannot find
			return null;
		}
	} );
	
	// dressing room canvas initiliazations	
	dressingRoomCanvas = new fabric.Canvas( 'dressingRoomModelCanvas', 
	{
		CANVAS_WIDTH: 240,
		CANVAS_HEIGHT: 638,
		selection: false,
		HOVER_CURSOR: 'pointer'
	} );
	$( '#dressingRoomModelCanvasArea' ).mouseleave( function()
	{
		dressingRoomCanvas.objectNoHover();
	} );	
	dressingRoomCanvas.observe( 'hover:object', function( e ) { dressingRoomCanvas.objectHover( e.memo.e, e.memo.target ); } );
	dressingRoomCanvas.observe( 'hover:no', function() { dressingRoomCanvas.objectNoHover(); } );
	dressingRoomCanvas.observe( 'object:selected', function( e ) { dressingRoomCanvas.objectSelect( e.memo.e, e.memo.target ); } );
	dressingRoomCanvas.observe( 'selection:cleared', function() { dressingRoomCanvas.objectNoSelection(); } );
	dressingRoomCanvas.observe( 'after:render', function() { dressingRoomCanvas.specialDraw(); } );	
	dressingRoomCanvas.updateFindTarget();
	dressingRoomCanvas.redraw();
	
	// creations canvas initializations
	creationsCanvas = new fabric.Canvas( 'creationsModelCanvas', 
	{
		CANVAS_WIDTH: 240,
		CANVAS_HEIGHT: 638,
		selection: false,
		HOVER_CURSOR: 'pointer'
	} );
	$( '#creationsModelCanvasArea' ).mouseleave( function()
	{
		creationsCanvas.objectNoHover();
	} );	
	creationsCanvas.observe( 'hover:object', function( e ) { creationsCanvas.objectHover( e.memo.e, e.memo.target ); } );
	creationsCanvas.observe( 'hover:no', function() { creationsCanvas.objectNoHover(); } );
	creationsCanvas.observe( 'after:render', function() { creationsCanvas.specialDraw(); } );	
	creationsCanvas.updateFindTarget();
	creationsCanvas.redraw();
	
	// circle canvasses
	circleCanvas1 = new fabric.Canvas( 'circlesWallItem1Canvas', 
	{
		CANVAS_WIDTH: 240,
		CANVAS_HEIGHT: 638,
		selection: false,
		HOVER_CURSOR: 'pointer'
	} );
	$( '#circlesWallItem1CanvasArea' ).mouseleave( function()
	{
		circleCanvas1.objectNoHover();
	} );
	$( '#circlesWallItem1CanvasArea' ).mousemove( function()
	{
		circleCanvas1.calcOffset();	
	} );	
	circleCanvas1.observe( 'hover:object', function( e ) { circleCanvas1.objectHover( e.memo.e, e.memo.target ); } );
	circleCanvas1.observe( 'hover:no', function() { circleCanvas1.objectNoHover(); } );
	circleCanvas1.observe( 'after:render', function() { circleCanvas1.specialDraw(); } );	
	circleCanvas1.updateFindTarget();
	circleCanvas1.redraw();
	
	circleCanvas2 = new fabric.Canvas( 'circlesWallItem2Canvas', 
	{
		CANVAS_WIDTH: 240,
		CANVAS_HEIGHT: 638,
		selection: false,
		HOVER_CURSOR: 'pointer'
	} );
	$( '#circlesWallItem2CanvasArea' ).mouseleave( function()
	{
		circleCanvas2.objectNoHover();
	} );	
	$( '#circlesWallItem2CanvasArea' ).mousemove( function()
	{
		circleCanvas2.calcOffset();	
	} );
	circleCanvas2.observe( 'hover:object', function( e ) { circleCanvas2.objectHover( e.memo.e, e.memo.target ); } );
	circleCanvas2.observe( 'hover:no', function() { circleCanvas2.objectNoHover(); } );
	circleCanvas2.observe( 'after:render', function() { circleCanvas2.specialDraw(); } );	
	circleCanvas2.updateFindTarget();
	circleCanvas2.redraw();		
}
