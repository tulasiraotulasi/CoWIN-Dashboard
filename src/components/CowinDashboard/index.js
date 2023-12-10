import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiLoadState = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}
class CowinDashboard extends Component {
  state = {
    isActive: apiLoadState.initial,
    urlDataAge: [],
    urlDataGender: [],
    urlDataCoverage: [],
  }

  componentDidMount() {
    this.getApiCall()
  }

  getApiCall = async () => {
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)
    console.log(response.ok)
    if (response.ok === true) {
      this.setState({isActive: apiLoadState.inProgress})
      const data = await response.json()

      const updatedUrlDataCoverage = data.last_7_days_vaccination.map(list => ({
        vaccineDate: list.vaccine_date,
        dose1: list.dose_1,
        dose2: list.dose_2,
      }))

      const updatedUrlDataGender = data.vaccination_by_gender
      const updatedUrlDataAge = data.vaccination_by_age

      this.setState({
        urlDataAge: updatedUrlDataAge,
        urlDataGender: updatedUrlDataGender,
        urlDataCoverage: updatedUrlDataCoverage,
      })

      this.setState({isActive: apiLoadState.success})
    } else {
      this.setState({isActive: apiLoadState.failure})
    }
  }

  inPageLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderCharts = () => {
    const {urlDataAge, urlDataGender, urlDataCoverage} = this.state

    return (
      <>
        <VaccinationCoverage urlDataCoverage={urlDataCoverage} />
        <VaccinationByGender urlDataGender={urlDataGender} />
        <VaccinationByAge urlDataAge={urlDataAge} />
      </>
    )
  }

  renderFailer = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderAllCharts = () => {
    const {isActive} = this.state
    switch (isActive) {
      case apiLoadState.inProgress:
        return this.inPageLoader()
      case apiLoadState.success:
        return this.renderCharts()
      case apiLoadState.failure:
        return this.renderFailer()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="mainDivHeader">
        <div className="div1">
          <div className="headerName">
            <img
              className="co-win"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="heading">Co-WIN</h1>
          </div>
          <h1 className="india">CoWIN vaccination in India</h1>
        </div>
        {this.renderAllCharts()}
      </div>
    )
  }
}

export default CowinDashboard
