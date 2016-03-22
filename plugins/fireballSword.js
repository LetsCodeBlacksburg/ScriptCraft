var items = require('items');
var entities = require('entities');

var cm = Packages.net.canarymod;
var factory = cm.Canary.factory();
var entityFactory = factory.entityFactory;
var cmLocation = cm.api.world.position.Location;
var cmEnchantment = cm.api.inventory.Enchantment.Type;

function onArmSwing( event ) {
  var player = event.player;
  var itemInHand = player.getItemHeld();
  if ( player.getHealth() == 20 && isFireballSword(itemInHand) )
  {
    shootFireball(player);
  }
}

function isFireballSword( item ) 
{

  if (item && item.getType() == items.diamondSword() ) 
  {
    var enchantment = item.getEnchantment();
    if (enchantment && enchantment.getLevel() == 3 && 
    	enchantment.getType() == cmEnchantment.LuckOfTheSea) {
      return true;
    }
  }
  return false;
}

function shootFireball(player) 
{
  var entityType = entities.largefireball();
  var loc = getBufferInFrontOfPlayer(player);

  var fireball = entityFactory.newEntity(entityType, loc);
  fireball.spawn();
  fireball.setPower(0); /* prevent fireball from destroying blocks */
  fling( player, fireball, 3 );

  var threeSeconds = 3000;
  setTimeout(function() { fireball.destroy(); }, threeSeconds);
}

events.playerArmSwing( onArmSwing );

function fling( player, entity, factor ) 
{
  var coord = cartesianCoords(player);
  var x = coord[0]; 
  var y = coord[1]; 
  var z = coord[2];
  entity.moveEntity(x * factor, y + 0.5, z * factor);
}

function cartesianCoords( player ) 
{
  var pitch = ( player.getPitch() + 90 ) * Math.PI / 180;
  var rot = ( player.getRotation() + 90 ) * Math.PI / 180;
  var x = Math.sin(pitch) * Math.cos(rot);
  var y = Math.cos(pitch);
  var z = Math.sin(pitch) * Math.sin(rot);
  return [x, y, z];
}

function getBufferInFrontOfPlayer(player)
{
  var coord = cartesianCoords(player);
  var distance = 2;
  var dx = coord[0] * distance; 
  var dy = coord[1] * distance; 
  var dz = coord[2] * distance;

  var loc = player.location;
  var x = loc.getX() + dx;
  var y = loc.getY() + dy + 0.5;
  var z = loc.getZ() + dz;
  return cmLocation(x, y, z);
}

var cmDiamondSword = items.diamondSword(1);
var itemFactory = factory.itemFactory;
var cmLuck = itemFactory.newEnchantment(cmEnchantment.LuckOfTheSea,3);
cmDiamondSword.addEnchantments( [ cmLuck ] );

var fireballSwordRecipe = new Object();
fireballSwordRecipe.result = cmDiamondSword;
fireballSwordRecipe.shape = [ 'BDB',
			      'BDB',
			      'BSB' ];
fireballSwordRecipe.ingredients = {
  B: items.blazeRod(1), 
  D: items.diamond(1),
  S: items.stick(1)
};

var recipes = require('recipes');
var recipe = recipes.create( fireballSwordRecipe );
server.addRecipe( recipe );
	    	
