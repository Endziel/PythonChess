import {PythonShell} from 'python-shell'


describe('empty spec', () => {
  beforeEach(() => {
    // reset and seed the database prior to every test
    // PythonShell.run('projekt/ser.py');
    // cy.exec('python projekt/ser.py')
    let options = {
      mode: 'text',
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: 'projekt/', //If you are having python_test.py script in same folder, then it's optional.
      args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1]
  };
    PythonShell.run('ser.py', options, function (err, result){
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        console.log('result: ', result.toString());
        res.send(result.toString())
  });;

    // // seed a post in the DB that we control from our tests
    // cy.request('POST', '/test/seed/post', {
    //   title: 'First Post',
    //   authorId: 1,
    //   body: '...',
    // })

    // // seed a user in the DB that we can control from our tests
    // cy.request('POST', '/test/seed/user', { name: 'Jane' })
    //   .its('body')
    //   .as('currentUser')
  })

  it('passes', () => {
    console.log()
    cy.visit('/')
  })
})