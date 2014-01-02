<? if($_SERVER['REQUEST_METHOD'] == "POST" ) {

	$destination = 'jackgao2006@gmail.com'; // change this to your email.

	// ##################################################
	// DON'T EDIT BELOW UNLESS YOU KNOW WHAT YOU'RE DOING
	// ##################################################

	$email   = $_POST['email'];
	$name	 = $_POST['name'];
	$message = $_POST['message'];
	$subject = '[BombeLanding]' . $name;

	$tes = mail($destination, $subject, $message);
	
	$email = $_POST['email'] . " ". $name . " ". $message . " ". $tes;
	$file  = 'teeest.txt';

		// Open the file to get existing content
		$current = file_get_contents($file);

		// Append a new email to the file
		$current .= "\n".$email;

		// Write the contents back to the file
		file_put_contents($file, $current);
}
