import React from 'react'
import download from 'downloadjs'
import './App.css'


class App extends React.PureComponent {
  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        file: null,
        selectedExtension: 'jpg'
      }
  }

  checkMimeType = event => {
    let file = event.target.files[0]
    let err = ''
    const types = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp']
    if (types.every(type => file.type !== type)) {
      err += file.type + ' is not a supported format\n'
    }
  
    if (err !== '') { 
      event.target.value = null 
      console.log(err)
      return false
    }
    return true
  }

  onChangeHandler = event => {
    if (this.checkMimeType(event)) {
      this.setState({
        selectedFile: event.target.files[0]
      })
    }
  }

  onClickHandler = async () => {
    const data = new FormData()

    data.append('file', this.state.selectedFile)
    
    const response = await fetch('http://localhost:8001/image/convert', {
      method: 'POST',
      headers: {
        'Extension': this.state.selectedExtension
      },
      body: data
    })
    const fileBlob = await response.blob()
    download(fileBlob, `${this.state.selectedFile.name.replace(/\.[^/.]+$/, "")}.${fileBlob.type.split('/')[1]}`, fileBlob.type)
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

  onSelectChange = event => {
    this.setState({ selectedExtension: event.target.value })
  }

  async componentDidUpdate() {
    if (this.state.selectedFile) {
      const file = await this.toBase64(this.state.selectedFile)
      this.setState({
        file
      })
    }
  }

  render() {
    return (
      <div className="App">
        <h1 className="header">Thank you for checking out my awesome image converter</h1>
        <p>1.Choose target extension</p><select className="section" onChange={this.onSelectChange} value={this.state.selectedExtension}>
          <option value="jpg">JPEG/JPG</option>
          <option value="gif">GIF</option>
          <option value="bmp">BMP</option>
          <option value="png">PNG</option>
        </select>
        <p>2.Upload file</p><input className="section" type="file" name="file" onChange={this.onChangeHandler}/>
        {
          this.state.file && <img className="image" key={this.state.file} src={this.state.file} />
        }
        <div className="section">
        <p>3.Convert image</p><button type="button" onClick={this.onClickHandler}>Convert</button>
        </div>
      </div>
  
    );
  }
  
}

export default App
