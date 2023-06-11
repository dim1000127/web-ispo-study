console.dir(localStorage.length);
$("span.counter").text(localStorage.length);
$(function(){  //Выполнить скрипт, когда загружен DOM:
    cardsLoad();
    //basketLoad();
    document.querySelector("div.row.no-gutters.goods").insertAdjacentHTML('beforeend', `<span style="padding-left: 80px" class="badSearch" >Ничего не найдено</span>`); 
        badSearch = (document.querySelector("span.badSearch"));
        badSearch.hidden= true;

    document.querySelector("div.row.no-gutters.goods").insertAdjacentHTML('beforeend', `<span style="padding-left: 80px" class="badFilter" >По заданным фильтрам ничего не найдено</span>`); 
        badFilter = (document.querySelector("span.badFilter"));
        badFilter.hidden= true;
    //переменные для фильтра
    category = "Все товары";
    sale = "False";
    $("div.search-btn").click(function(){
        let searchCards = document.querySelector("input.search-wrapper_input").value;
        search(searchCards);     
    })

    $("span.filter-check_label-text, span.filter-check_checkmark").on("click", function(){
        $('#discount-checkbox').prop("checked", function(i, val) {
            console.dir(val);
            val? $(this).attr('checked'):$(this).removeAttr('checked');
        });
        
        let checkSpan = document.querySelector("span.filter-check_checkmark");  
        if ($('#discount-checkbox').is(':checked')){       
            sale = "False";
            checkSpan.classList.toggle('checked');   
            $("#discount-checkbox").fadeTo(0, 0); 
            sortPrice();      
        } else {
            sale = "True";
            checkSpan.classList.toggle('checked');
            $("#discount-checkbox").fadeTo(0, 1);
            sortPrice(); 
        }
    })

    $("#min, #max").on('input',function(){
        sortPrice();
    });

    $('div.catalog-button').on("mouseover",function(){
        $('div.catalog').css('display', 'flex');
    });
    $('div.catalog-button').on("mouseout",function(){
        $('div.catalog').css('display', 'none');
    });

    $('#cart').on("click",function(){
        $('div.cart').css('display', 'flex');
        basketLoad();
    });

    $('div.cart-close').on("click",function(){
        $('div.cart').css('display', 'none');
    });

    $('div.row.no-gutters.goods').on("click", "button",function() {
        let buttonAll = $("div.row.no-gutters.goods").children().children().children().children("button");
        for(let i = 0; i<buttonAll.length; i++){
            if(buttonAll[i] == $(this)[0]){
                index = i;
            }
        }

        let dataCard = items["items"][index];
        //console.dir(dataCard);
        let keyCard = 'card' + localStorage.length;
        for (let i = 0; i < localStorage.length; i++) {
            let storedValue = localStorage.key(i);
            if (storedValue == keyCard){
                keyCard += 1;
            }
        }
        localStorage.setItem(keyCard,  JSON.stringify(dataCard));
        $("span.counter").text(localStorage.length);
    });

    $('div.cart-wrapper').on("click", "button",function(event) {
        let buttonAllCart = $("div.cart-wrapper").children().children().children("button");
        for(let i = 0; i<buttonAllCart.length; i++){
            if(buttonAllCart[i] == $(this)[0]){
                index = i;
            }
        }

        for (let i = 0; i < localStorage.length; i++) {
            let storedValue = localStorage.key(i);

            if(index == i)
            {
                localStorage.removeItem(storedValue);
            }
        }
        basketLoad()
    });
});

function Ris(i)
{
    document.querySelector("div.row.no-gutters.goods").insertAdjacentHTML('beforeend', `<div class="col-12 col-md-6 col-lg-4 col-xl-3">
        <div class="card">
            <div class="card-img-wrapper">
            <div class="card-sale">&#128293;Hot sales!&#128293;</div>
                <span class="card-img-top"
                style="background-image: url('${items["items"][i]["img"]}')"></span>
                </div>
                <div class="card-body justify-content-between">
                <div class="card-price">${items["items"][i]["price"]} ₽</div>
                <h5 class="card-title">${items["items"][i]["title"]}</h5>
                <button class="btn btn-primary">В корзину</button>
                </div>
            </div>
        </div> `)
    saleHid(i);
}

function saleHid(_i)
{
    let saleLen = $("div.card-sale");
    //console.dir(saleLen);
    if (items["items"][_i]["sale"] == "False"){
        saleLen[_i].hidden = true;
    }
}

function ochis()
{
    $("div.row.no-gutters.goods").empty();
}

function cardsLoad(){
    $.ajax({
        url: 'http://localhost/globalLaba/src/connect.php', // путь к php-обработчику
        type: 'POST', // метод передачи данных
        dataType: 'json', // тип ожидаемых данных в ответе
        error: function(req, text, error){ // отслеживание ошибок во время выполнения ajax-запроса
        alert('Хьюстон, У нас проблемы! ' + text + ' | ' + error);
        },
        success: function(json){ // функция, которая будет вызвана в случае удачного завершения запроса к серверу
            items = [];
            items = json;
            console.dir(items);
            len = items["items"].length;
            lenCat = items["cat"].length;
            for(let i = 0; i<len; i++){    
                Ris(i);
            }

            document.querySelector("ul.catalog-list").insertAdjacentHTML('beforeend', `<li><span class="all-items">Все товары</span></li>`);

            $('span.all-items').on("click",function(){
                category = "Все товары";
                sortPrice();
            });

            for(let i = 0; i<lenCat; i++){
                document.querySelector("ul.catalog-list").insertAdjacentHTML('beforeend', `<li><span class="catalog-list-items">${items["cat"][i]["category"]}</span></li>`); 
            }
        
            $('span.catalog-list-items').on("click",function() {
                let textCat = $(this).text();
                category = textCat;
                sortPrice();
            });
        }        
    });       
}

function search(_searchCards){
    category = "Все товары";
    $("#min")[0].value = null;
    $("#max")[0].value = null;
    if(sale == "True"){
        let checkSpan = document.querySelector("span.filter-check_checkmark");
        $("#discount-checkbox").removeAttr('checked');
        $("#discount-checkbox").fadeTo(0, 0); 
        checkSpan.classList.toggle('checked');
        sale = "False";
    }

    badSearch.hidden= true;
    badFilter.hidden = true;
    let cardsAll = (document.getElementsByClassName("col-12 col-md-6 col-lg-4 col-xl-3"));
    let srch = new RegExp(_searchCards, "i");// i- не учит. рег.
    let k = 0;
    if (_searchCards != ""){
    
        for(let i = 0; i<len; i++)
        {
            if (srch.test(items["items"][i]["title"])){
                cardsAll[i].hidden = false;
                k++;
            }
            else{
                cardsAll[i].hidden = true;
            }
        }
        if (k==0){
            badSearch.hidden=false;
        }
        else{
            badSearch.hidden=true;
        }
    }
    else {
        for(let i = 0; i<len; i++)
        {
            cardsAll[i].hidden = false;
        }
    }
}

function sortPrice(){
    badFilter.hidden= true;
    badSearch.hidden=true;
    console.dir(category);
    console.dir(sale);
    if (category == "Все товары"){
        catalogVisAll();
    }
    else{
        catalogVis(category);
    }

    let minPrice = parseInt($("#min")[0].value);
    let maxPrice = parseInt($("#max")[0].value);
    let cardsAll = (document.getElementsByClassName("col-12 col-md-6 col-lg-4 col-xl-3"))  
    for(let i = 0; i<cardsAll.length; i++)
    {
        if(cardsAll[i].hidden == false){
            if((minPrice != null || minPrice != "") || (maxPrice != null || maxPrice != "")){               
                if (minPrice >= parseInt(items["items"][i]["price"]) || (maxPrice <= parseInt(items["items"][i]["price"]))){  
                    cardsAll[i].hidden = true; 
                }  
            }  
        }                                        
    }

    if(sale == "True"){
        saleVisible();
    }

    let k = 0;
    for(let i = 0; i<cardsAll.length; i++){
        if(cardsAll[i].hidden == true){
            k++
        }
    }

    if(k == len){
        badFilter.hidden = false;
    }
}

function catalogVis(_vgc){
    let cardsAll = (document.getElementsByClassName("col-12 col-md-6 col-lg-4 col-xl-3"))
    for(let i = 0; i<len; i++)
    {
        if (_vgc == (items["items"][i]["category"])){
            cardsAll[i].hidden = false;               
        }
        else{
            cardsAll[i].hidden = true;
        }
    }
}

function catalogVisAll(){
    let cardsAll = (document.getElementsByClassName("col-12 col-md-6 col-lg-4 col-xl-3"))
    for(let i = 0; i<len; i++)
    {
        cardsAll[i].hidden = false;
    }
}

function saleVisible(){
    let cardsAll = (document.getElementsByClassName("col-12 col-md-6 col-lg-4 col-xl-3"))
    for(let i = 0; i<cardsAll.length; i++)
    {
        if(cardsAll[i].hidden == false){
            if (items["items"][i]["sale"] == "True"){
                cardsAll[i].hidden = false;               
            }
            else{
                cardsAll[i].hidden = true;
            }
        }          
    }
}

function basketLoad(){
    ochisCart();
    if(localStorage.length == 0){
        $('#cart-empty').css('display', 'flex');
    }
    else{
        $('#cart-empty').css('display', 'none');
    }

    carts = [];

    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);

        RisCart(JSON.parse(localStorage.getItem(key)));
        carts.push(JSON.parse(localStorage.getItem(key))); 
    }

    $("span.counter").text(localStorage.length);

    calculationSumm();
    if(localStorage.length == 0){
        $("form.cust").css('display', 'none');
    }
    else{
        $("form.cust").css('display', 'flex');
    }  
}

function calculationSumm(){
    let priceDiv = $("div.cart-wrapper").children().children().children("div.card-price");
    summ = 0;
    for(let i = 0; i<priceDiv.length; i++){
        val = $(priceDiv[i]).text();
        val = val.slice(0, -2);
        summ += parseInt(val);;
    }
    $("div.cart-total").children().text(summ);
}

function RisCart(_carts)
{
    if(_carts["sale"] == "False"){
        document.querySelector("div.cart-wrapper").insertAdjacentHTML('beforeend', `<div class="card">
        <div class="card-img-wrapper">
            <span class="card-img-top"
            style="background-image: url('${_carts["img"]}')"></span>
            </div>
            <div class="card-body justify-content-between">
            <div class="card-price">${_carts["price"]} ₽</div>
            <h5 class="card-title">${_carts["title"]}</h5>
            <button class="btn btn-primary">Удалить из корзины</button>
            </div>
        </div> `)
    }
    else{
        document.querySelector("div.cart-wrapper").insertAdjacentHTML('beforeend', `<div class="card">
            <div class="card-img-wrapper">
            <div class="card-sale">&#128293;Hot sales!&#128293;</div>
                <span class="card-img-top"
                style="background-image: url('${_carts["img"]}')"></span>
                </div>
                <div class="card-body justify-content-between">
                <div class="card-price">${_carts["price"]} ₽</div>
                <h5 class="card-title">${_carts["title"]}</h5>
                <button class="btn btn-primary">Удалить из корзины</button>
                </div>
            </div> `)
    }
}

function ochisCart()
{
    $('div.cart-wrapper').children().slice(1).remove();
}

function addOrder(){
    let orderData = $('form.cust').serializeArray();
    let json = JSON.stringify(carts);
    let cart = {     
        name: "carts",  
        value: json       
      };

    orderData.push(cart);

    console.dir(orderData);

    $.ajax({
        url: 'http://localhost/globalLaba/src/connectOrder.php', // путь к php-обработчику
        type: 'POST', // метод передачи данных
        data: orderData, 
        error: function(req, text, error){ // отслеживание ошибок во время выполнения ajax-запроса
        alert('Хьюстон, У нас проблемы! ' + text + ' | ' + error);
        },
        success: function(data){ // функция, которая будет вызвана в случае удачного завершения запроса к серверу
            console.dir(data);
        }        
    });

    return false;
}