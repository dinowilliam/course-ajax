(function () {

    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');    
    const responseContainer = document.querySelector('#response-container');
    
    let searchedForText = 'hippos';    

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        resquestImages();
    });

    resquestImages();
    
    function resquestImages(){
        let unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID ' + readTextFile("ClientID.txt") );
        unsplashRequest.onload = addImage;
        unsplashRequest.send();
    };
    
    function addImage(){
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if(data && data.results && data.results[0]){
            const firstImage = data.results[0];
            htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        }
        else{
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    } 

    function readTextFile(file){
        var allText = '';        
        var openFile = new XMLHttpRequest();

        openFile.open("GET", file, false);
        openFile.onreadystatechange = function (){
            if(openFile.readyState === 4){
                if(openFile.status === 200 || openFile.status == 0){
                    allText = openFile.responseText;                    
                }
            }
        }

        openFile.send(null);
       
        return allText;
    }   

})();


