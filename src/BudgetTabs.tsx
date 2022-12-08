import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import GuitosTable from './GuitosTable';

function BudgetTabs() {
  return (
    <Tabs
      defaultActiveKey="profile"
      id="justify-tab-example"
      className="mb-3"
      justify
    >
      <Tab eventKey="home" title="Home">
        <GuitosTable />
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <GuitosTable />
      </Tab>
      <Tab eventKey="longer-tab" title="Loooonger Tab">
        <GuitosTable />
      </Tab>
      <Tab eventKey="contact" title="Contact" disabled>
        <GuitosTable />
      </Tab>
    </Tabs>
  );
}

export default BudgetTabs;