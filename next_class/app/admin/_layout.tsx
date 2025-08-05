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
      <Drawer.Screen name="add-role" options={{ title: " Roles" }} />
      <Drawer.Screen name="add-user" options={{ title: "Users" }} />
      <Drawer.Screen name="add-department" options={{ title: "Departments" }} />
      <Drawer.Screen name="add-course" options={{ title: "Courses" }} />
      <Drawer.Screen name="add-leave" options={{ title: "Leave" }} />
      <Drawer.Screen name="add-batch" options={{ title: "Batch" }} />
    </Drawer>
  );
}
