
import React, { Component } from "react";
import Notifications, { notify } from 'react-notify-toast'
import Spinner from '../../components/CloudinaryUploadImage/Spinner'
import Images from '../../components/CloudinaryUploadImage/Images'
import Buttons from '../../components/CloudinaryUploadImage/Buttons'
import WakeUp from '../../components/CloudinaryUploadImage/WakeUp'
import Footer from '../../components/CloudinaryUploadImage/Footer'
import { API_URL } from '../../components/CloudinaryUploadImage/config'
import './UploadImage.css'
// import API from "../../utils/API";
// import ImageUrl from "../../components/CloudinaryUploadImage/Images.js";

const toastColor = { 
  background: '#505050', 
  text: '#fff' 
}

export default class UploadImage extends Component {
  
  state = {
    loading: true,
    uploading: false,
    images: []
  }

  componentDidMount() {
    fetch(`${API_URL}/wake-up`)
      .then(res => {
        if (res.ok) {
          return this.setState({ loading: false })  
        }
        const msg = 'Something is went wrong with Heroku' 
        this.toast(msg, 'custom', 2000, toastColor)
      })
  }

  toast = notify.createShowQueue()

  onChange = e => {
    const errs = [] 
    const files = Array.from(e.target.files)

    if (files.length > 3) {
      const msg = 'Only 3 images can be uploaded at a time'
      return this.toast(msg, 'custom', 2000, toastColor)  
    }

    const formData = new FormData()
    const types = ['image/png', 'image/jpeg', 'image/gif']

    files.forEach((file, i) => {

      if (types.every(type => file.type !== type)) {
        errs.push(`'${file.type}' is not a supported format`)
      }

      if (file.size > 150000) {
        errs.push(`'${file.name}' is too large, please pick a smaller file`)
      }

      formData.append(i, file)
    })

    if (errs.length) {
      return errs.forEach(err => this.toast(err, 'custom', 2000, toastColor))
    }

    this.setState({ uploading: true })

    fetch(`${API_URL}/image-upload`, {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw res
      }
      return res.json()
    })
    .then(images => {
      this.setState({
        uploading: false, 
        images
      })
    })
    .catch(err => {
      err.json().then(e => {
        this.toast(e.message, 'custom', 2000, toastColor)
        this.setState({ uploading: false })
      })
    })
    // API.saveImage({
    //   image_url: ImageUrl.image.secure_url
    // })
    //   // .then(() => loadImage())
    //   .catch(err => console.log(err));

  }

  filter = id => {
    return this.state.images.filter(image => image.public_id !== id)
  }

  removeImage = id => {
    this.setState({ images: this.filter(id) })
  }

  onError = id => {
    this.toast('Oops, something went wrong', 'custom', 2000, toastColor)
    this.setState({ images: this.filter(id) })
  }
  
  render() {
    const { loading, uploading, images } = this.state
    
    const content = () => {
      switch(true) {
        case loading:
          return <WakeUp />
        case uploading:
          return <Spinner />
        case images.length > 0:
          return <Images 
                  images={images} 
                  removeImage={this.removeImage} 
                  onError={this.onError}
                 />
        default:
          return <Buttons onChange={this.onChange} />
      }
    }

    return (
      <div className='container'>
        {/* <img src={"https://res.cloudinary.com/hjlogique/image/upload/v1610523731/korid4uwopipo2siiuth.png"}/> */}
        <Notifications />
        <div className='buttons'>
          {content()}
        </div>
        <Footer />
      </div>
    )
  }
}
