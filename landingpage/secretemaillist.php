<?php
$v = explode("\n", file_get_contents( "emails.txt" )); // get the contents, and echo it out.

for($i = 0; $i < sizeof($v); $i++){
echo ('' . ($i + 1) . ' ' . $v[$i] . '<br/>');
}
?>