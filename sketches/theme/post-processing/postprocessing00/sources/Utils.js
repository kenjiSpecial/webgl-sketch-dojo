/*!
 * THREE.Extras.UTils contains extra useful methods
 * 
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * 
 */

THREE = THREE || {};
THREE.Extras = THREE.Extras || {};
THREE.Extras.Utils = THREE.Extras.Utils || {};

/*! Projects object origin into screen space coordinates using provided camera */
THREE.Extras.Utils.projectOnScreen = function(object, camera)
{
	var mat = new THREE.Matrix4();
	mat.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld);
	mat.multiplyMatrices( camera.projectionMatrix , mat);

	//var c = mat.n44;
	var c = mat.elements[15];
	var n14 = mat.elements[12];
	var n24 = mat.elements[13];
	var n34 = mat.elements[14];
	//console.log(mat.n44);
	var lPos = new THREE.Vector3( n14/c, n24/c, n34/c);
	lPos.multiplyScalar(0.5);
	lPos.addScalar(0.5);
	return lPos;
}