document.addEventListener("DOMContentLoaded", () => {
    const bakesContainer = document.querySelector("#bakes-container")
    let bakesArray = []

    fetch("http://localhost:3000/bakes")
    .then (r => r.json())
    .then (data => {
        bakesArray = data
        renderBakes(bakesArray)
    })

    function renderBakes(bakesArray) {
        bakesArray.forEach(renderBakeLi)
        renderBakeDetails(bakesArray[0])
    }

    function renderBakeLi(bake) {
        const bakeLi = document.createElement("li")
        bakeLi.innerText = bake.name
        bakeLi.className = "item"
        bakeLi.id = `bake-${bake.id}`

        bakeLi.addEventListener("click", () => {
            renderBakeDetails(bake)
        })

        bakesContainer.append(bakeLi)
    }

    function renderBakeDetails(bake) {
        const featuredBake = document.querySelector("#detail")
        featuredBake.innerHTML = `
            <img src="${bake.image_url}" alt="${bake.name}">
            <h1>${bake.name}</h1>
            <p class="description">${bake.description}</p>
            <form id="score-form" data-id="${bake.id}">
                <input value="${bake.score}" type="number" name="score" min="0" max="10" step="1">
                <input type="submit" value="Rate">
            </form>` 


        const rateForm = document.querySelector("#score-form")
        rateForm.addEventListener("submit", rateBake)
    }

    const bakeForm = document.querySelector("#new-bake-form")
    bakeForm.addEventListener("submit", createCake)

    function createCake(event) {
        event.preventDefault()

        let newCake = formData(event)

        fetch('http://localhost:3000/bakes', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCake)
        })
        .then(res => res.json())
        .then(bake => {
           renderBakeLi(bake) 
        })
        bakeForm.reset()
      }
    

    function formData(event) {
        return {
          name: event.target.name.value,
          image_url: event.target.image_url.value,
          description: event.target.description.value
        }
    }

    
    function rateBake(event) {
        event.preventDefault()

        fetch(`http://localhost:3000/bakes/${event.target.dataset.id}/ratings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 699a9ff1-88ca-4d77-a26e-e4bc31cfc261"
            },
            body: JSON.stringify({score: event.target.score.value})
        })
        .then(r => r.json())
        .then(bake => {
            const bakeLi = document.querySelector(`#bake-${bake.id}`)
            bakeLi.addEventListener("click", () => {
                renderBakeDetails(bake)
            })
        })
    }

    const judgeButton = document.querySelector("#judge-bake-button")
    judgeButton.addEventListener("click", () => {
       fetch("http://localhost:3000/bakes/winner") 
        .then (r => r.json())
        .then (winner => {
            let winnerLi = document.querySelector(`#bake-${winner.id}`)
            winnerLi.className += " winner"
        } )

    })

})