import CustomRequestForm from '../components/CustomRequestForm.jsx'

export default function Customize() {
  return (
    <div className="container">
      <section className="section">
        <div className="bespoke">
          <div>
            <p className="eyebrow dash">Bespoke builds</p>
            <h1 className="display h2">Customize your airplane model</h1>
            <p className="lead" style={{ marginTop: 18 }}>
              Have an aircraft, livery, or tail flash in mind? Send us a message and a reference photo if you have one, and a designer will follow up by email to work out the details.
            </p>
            <ul className="checklist">
              <li>Share reference photos or markings</li>
              <li>Describe scale, finish, and special requests</li>
              <li>Hear back from a designer by email</li>
            </ul>
          </div>
          <CustomRequestForm />
        </div>
      </section>
    </div>
  )
}
