{
    const API_KEY = '4p7w4YD3KnU48WzncbVg5PTrJYdGB4yk';
    let offset = 0;
    let fetchType = "";

    generateApiUrl = (type) => {
        let url = "";

        switch (type) {
            case "trending":
                fetchType = "trending";
                url = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&offset=${offset}`;
                break
            case "search":
                fetchType = "search";
                // get data from search input
                const searchInput = document.getElementById("search").value;
                url = `https://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=${API_KEY}&offset=${offset}`;
                break;
        }
        return url;
    }

    searchGifStart = () => {
        cleanDivs();
        getGif("search");
    }

    trendGifStart = () => {
        cleanDivs();
        getGif("trending");
    }

    getGif = (type) => {
        let url = generateApiUrl(type);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(res => {
                loadGifs(res.data);
            }).catch(err => console.log(err));
    }

    loadGifs = (result) => {
        // iterate trough result
        result.map(item => {
            const images = item.images;
            const downsizedStatic = images.downsized_still.url;
            const downsized = images.downsized.url;
            const original = images.downsized.url;

            // create img element
            const newImg = document.createElement("img");
            newImg.setAttribute("static", downsizedStatic);
            newImg.setAttribute("animated", downsized);
            newImg.setAttribute("original", original);
            newImg.setAttribute("src", downsizedStatic);

            // add newImg element to div result
            document.getElementById("result").appendChild(newImg);
        });
        addListenersToImages();
    }

    cleanDivs = () => {
        offset = 0;
        document.getElementById("result").innerHTML = "";
    }

    addListenersToImages = () => {
        let allImages = document.getElementsByTagName("img");

        for (let i = 0; i < allImages.length; i++) {
            allImages[i].onmouseover = animateGifs;
            allImages[i].onmouseout = removeAnimationGifs;
            allImages[i].onclick = showPopUp;
        }
        ;
    }

    showPopUp = (e) => {
        const imgUrl = e.target.attributes.original.value
        Swal.fire({
            imageUrl: imgUrl,
            showCloseButton: true,
            showConfirmButton: false
        });
    }

    animateGifs = (e) => {
        const img = e.target;
        img.src = img.attributes.animated.value;
    }

    removeAnimationGifs = (e) => {
        const img = e.target;
        img.src = img.attributes.static.value;
    }

    infiniteScroll = () => {
        const d = document.documentElement;
        const offset = d.scrollTop + window.innerHeight;
        const height = d.offsetHeight;

        if (offset === height) {
            console.log('bottom of the page');
            increaseOffset();
            getGif(fetchType);
        }
    }

    increaseOffset = () => {
        offset = offset + 25;
    }

    document.getElementById("searchBtn").addEventListener("click", searchGifStart);
    document.getElementById("trendsBtn").addEventListener("click", trendGifStart);

    document.addEventListener("scroll", infiniteScroll);
}
