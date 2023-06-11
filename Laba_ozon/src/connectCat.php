<?php
    $conn = new mysqli("localhost", "root", "root", "o_zone");
    if ($conn->connect_error) die ("Fatal Error");
    $resultCat = array();
    $queryCat = "SELECT DISTINCT category FROM db";
    $resultCat = $conn->query($queryCat);
    while($rowCat = $resultCat->fetch_assoc()){ 
        $dataCat[] = $rowCat; 
    }
    echo json_encode($dataCat, JSON_UNESCAPED_UNICODE)
?>