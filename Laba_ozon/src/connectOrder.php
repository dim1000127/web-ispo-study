<?php
    $conn = new mysqli("localhost", "root", "root", "o_zone");
    if ($conn->connect_error) die ("Fatal Error");

    //назначение рандомного номера заказа
    //проверка сгенерированного номера с номерами в бд
    $query = "SELECT number FROM orders";
    $result = $conn->query($query);
    while($row = $result->fetch_assoc()){ 
        $numberArr[] = $row["number"];
    }

    $id = rand(1,999999);
    for ($i = 1; $i <= count($numberArr); $i++) {
        if($id ==  $numberArr[$i]){
            $id = rand(1,999999);
            $i++;
        }
    }

    if (!($stmt = $conn->prepare("INSERT INTO orders(number, name, phone, title, price) VALUES (?, ?, ?, ?, ?)"))) {
        echo "Не удалось подготовить запрос: (" . $conn->errno . ") " . $conn->error;
    }

    if (isset($_POST["name"]) && isset($_POST["phone"]) ) 
	{ 
        if ($_POST['name'] == '') 
        {
            echo 'Не заполнено поле Имя';
            return; //проверяем наличие обязательных полей
        }
        if ($_POST['phone'] == '') 
        {
            echo 'Не заполнено поле Номер телефона';
            return;
        } 
        $name = $_POST['name'];
        $phone = $_POST['phone']; 
    }

    $titleJS = json_decode($_POST['carts']);
    print_r($titleJS);
    

    $title = "";
    $price = "";
    for($i = 0; $i <= count($titleJS); $i++)
    {
        $title = $titleJS[$i]->title;
        $price = $titleJS[$i]->price;
        if (!$stmt->bind_param("issss",$id, $name, $phone, $title,  $price)) {
            echo "Не удалось привязать параметры: (" . $stmt->errno . ") " . $stmt->error;
        }

        if (!$stmt->execute()) {
            echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
        }
        else{
            echo 'Заявка отправлена!';
            return; //возвращаем сообщение пользователю
        }
    }

    $stmt->close(); 
?>

