const d = document,
    $select = d.getElementById('dog-selector'),
    $dogContainer = d.getElementById('dog-container'),
    $fragment = d.createDocumentFragment();
let breedsData = [];


// Función para mostrar todos los perros
const displayAllDogs = (breeds) => {
    $dogContainer.innerHTML = ''; //Limpiar el contenedor

    breeds.forEach((el) => {
        if (el.reference_image_id) {
            fetch(`https://api.thedogapi.com/v1/images/${el.reference_image_id}`)
                .then(response => response.json())
                .then(imageData => {
                    const dogDiv = d.createElement('div');
                    dogDiv.innerHTML = `
                        <h3>${el.name}</h3>
                        <img src="${imageData.url}" alt="${el.name}">
                    `;
                    $dogContainer.appendChild(dogDiv);
                })
                .catch(() => {
                    const dogDiv = d.createElement('div');
                    dogDiv.innerHTML = `
                        <h3>${el.name}</h3>
                        <img src="https://via.placeholder.com/300" alt="${el.name}">
                    `;
                    $dogContainer.appendChild(dogDiv);
                });
        }
    });
}

// Función para mostrar una raza específica
const displayDog = (dog, imageUrl) => {
    $dogContainer.innerHTML = `
        <div class="content">
        <h2>${dog.name}</h2>
        <img src="${imageUrl}" alt="${dog.name}">
        <p><strong>Bred for:</strong> ${dog.bred_for || 'Información no disponible'}</p>
        <p><strong>Breed Group:</strong> ${dog.breed_group || 'Información no disponible'}</p>
        <p><strong>Life span:</strong> ${dog.life_span || 'Información no disponible'}</p>
        <p><strong>Temperament:</strong> ${Array.isArray(dog.temperament) ? dog.temperament.join(', ') : dog.temperament || 'Información no disponible'}</p>
        </div>
    `;
}


// Cargar las razas de perros en el select
fetch('https://api.thedogapi.com/v1/breeds')
    .then((res) => res.ok ? res.json() : Promise.reject(res))
    .then((json) => {
        breedsData = json;
        json.forEach(el => {
            const option = d.createElement('option');
            option.value = el.id;
            option.textContent = el.name;
            $fragment.appendChild(option);
        });

        const allOption = d.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All';
        $fragment.prepend(allOption); // Agregar la opción "All" al principio
        $select.appendChild($fragment);

        // Seleccionar por defecto la opción "All" y mostrar todos los perros
        $select.value = 'all';
        displayAllDogs(breedsData); // Mostrar todos los perros al cargar la página
    })
    .catch((err) => {
        let message = err.statusText || 'Ocurrió un error';
        $dogContainer.innerHTML = `Error ${err.status}: ${message}`;
    });

// Escuchar el evento change del select
$select.addEventListener('change', (e) => {
    const breedId = e.target.value;

    if (breedId === 'all') {
        // Mostrar todas las razas si selecciona "All"
        displayAllDogs(breedsData);
    } else {
        // Mostrar la raza seleccionada
        const selectedBreed = breedsData.find(breed => breed.id == breedId);
            
        if (selectedBreed && selectedBreed.reference_image_id) {
            fetch(`https://api.thedogapi.com/v1/images/${selectedBreed.reference_image_id}`)
                .then((res) => res.ok ? res.json() : Promise.reject(res))
                .then(imageData => displayDog(selectedBreed, imageData.url))
                .catch(() => displayDog(selectedBreed, 'https://via.placeholder.com/300'));
        } else {
                displayDog(selectedBreed, 'https://via.placeholder.com/300');
        }
    }
});

