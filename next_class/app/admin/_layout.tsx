import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../CustomDrawerContent'; 

export default function AdminLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 220, 
        },
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Admin Home" }} />
      <Drawer.Screen name="add-role" options={{ title: "Add Role" }} />
      <Drawer.Screen name="add-user" options={{ title: "Add User" }} />
      <Drawer.Screen name="add-department" options={{ title: "Add Department" }} />
      <Drawer.Screen name="add-course" options={{ title: "Add Course" }} />
      <Drawer.Screen name="add-leave" options={{ title: "Add Leave" }} />
    </Drawer>
  );
}
