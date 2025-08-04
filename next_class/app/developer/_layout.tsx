// app/developer/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function DeveloperLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: '#34495e' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#2980b9',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Developer Dashboard',
        }}
      />
      <Drawer.Screen
        name="create-college"
        options={{
          title: 'Create College',
        }}
      />
    </Drawer>
  );
}
