const restaurantsList = document.querySelector('.restaurants-list')

if (restaurantsList) {
  const myModal = new bootstrap.Modal(document.querySelector('.modalBox'))
  const form = document.querySelector('#delete-submit')
  const modalFooter = document.querySelector('.modal-footer')
  restaurantsList.addEventListener('click', event => {
    if (event.target.id === 'delete-btn') {
      const id = event.target.dataset.id
      form.action = `/admin/restaurants/${id}?_method=DELETE`
      myModal.show()
      modalFooter.addEventListener('click', event => {
        if (event.target.classList.contains('delete-confirm') || event.target.classList.contains('delete-giveup')) {
          myModal.hide()
        }
      })
    }
  })
}