var items = require('items');
var entities = require('entities');

var cm = Packages.net.canarymod;
var factory = cm.Canary.factory();
var entityFactory = factory.entityFactory;
var cmEnchantment = cm.api.inventory.Enchantment.Type;
var cmFireball = Packages.net.canarymod.api.entity.LargeFireball;
var cmPlayer = cm.api.entity.living.humanoid.Player;
var cmLocation = cm.api.world.position.Location;

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

  //calc the position of the block in front of the player
  var coord = cartesianCoords(player);
  var BLOCKDISTANCE = 2;
  var dx = coord[0] * BLOCKDISTANCE;
  var dy = coord[1] * BLOCKDISTANCE;
  var dz = coord[2] * BLOCKDISTANCE;

  var loc = player.location;
  var x = loc.getX() + dx;
  var y = loc.getY() + dy + 0.5;
  var z = loc.getZ() + dz;
  var newLoc = cmLocation(x, y, z);

  var fireball = entityFactory.newEntity(entityType, newLoc);
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
  var x = coord[0]; var y = coord[1]; var z = coord[2];
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
	    	
