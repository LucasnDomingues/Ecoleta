
function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then( res => res.json())
        .then( states => {
            for( state of states){
                ufSelect.innerHTML+= `<option value="${state.id}">${state.nome}</option>`
            }
        });
}

populateUFs();

function getCities(event){
    const citySelect = document.querySelector("select[name=city]");
    const stateInput = document.querySelector("input[name=state]");

    const ufValue = event.target.value;
    const indexOfSelectedState = event.target.selectedIndex;
    stateInput.value = event.target.options[indexOfSelectedState].text;

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;
    citySelect.disabled = false;
    citySelect.innerHTML = ``

    fetch(url).then( res => res.json()).then( cities => {
        for( city of cities){
            citySelect.innerHTML+= `<option values="${city.nome}">${city.nome}</option>`
        }

    });
}

document.querySelector("select[name=uf]")
    .addEventListener("change",getCities);



const itemsToCollet = document.querySelectorAll(".items-grid li");
for( item of itemsToCollet){
    item.addEventListener("click",handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]");
let selectedItems = [];

function handleSelectedItem(event){
    const itemLi = event.target;
    itemLi.classList.toggle("selected");

    const itemId = itemLi.dataset.id;

    const alreadySelected = selectedItems.findIndex( item => item==itemId );

    if(alreadySelected >= 0){
        selectedItems = selectedItems.filter( item => item!=itemId );
    }else{
        selectedItems.push(itemId);
    }
   collectedItems.value = selectedItems;
}