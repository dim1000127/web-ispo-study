<?php
    $conn = new mysqli("localhost", "root", "root", "o_zone");
    if ($conn->connect_error) die ("Fatal Error");
    $result = array(); 
    $query = "SELECT * FROM db";
    $result = $conn->query($query);
    while($row = $result->fetch_assoc()){ 
        $data[] = $row; 
    }

    $resultCat = array();
    $queryCat = "SELECT DISTINCT category FROM db";
    $resultCat = $conn->query($queryCat);
    while($rowCat = $resultCat->fetch_assoc()){ 
        $dataCat[] = $rowCat; 
    }
    $dataAll = ['items'=>$data, 'cat'=>$dataCat];
    echo json_encode($dataAll, JSON_UNESCAPED_UNICODE);
?>