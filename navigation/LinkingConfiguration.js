import * as Linking from "expo-linking"

const linking = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          SignUp: {
            screens: {
              SignUpScreen: "SignUp"
            }
          },
          SignIn: {
            screens: {
              SignInScreen: "SignIn"
            }
          }
        }
      }
    }
  }
}

export default linking
