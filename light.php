<?php 
	$light = $_GET["light"];

	if(strcmp($light,'0') == 0){
		echo "light = 0";
		file_put_contents ('/home/moorbria/public_html/light.txt', $light );
	}elseif(strcmp($light,'1') == 0){
		echo "light = 1";
		file_put_contents ('/home/moorbria/public_html/light.txt', $light );
	}else{
		echo "light = not 0 or 1";
		// do nothing
	}
?>
