import React, { useContext } from 'react';
import { View, Button, StyleSheet } from 'react-native';

import { AuthContext } from '../../contexts/auth';

const SignIn: React.FC = () => {
  const { signIn } = useContext(AuthContext);

  const handleSignIn = () => {
    signIn();
  };

  return (
    <View style={styles.container}>
      <Button title="Sign in" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SignIn;
