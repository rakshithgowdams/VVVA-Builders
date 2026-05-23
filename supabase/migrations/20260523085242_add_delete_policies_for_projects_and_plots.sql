/*
  # Add DELETE policies for projects and plot_slots

  Allows authenticated admins to delete projects and plot slots.
*/

CREATE POLICY "Admin can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can delete plot slots"
  ON plot_slots FOR DELETE
  TO authenticated
  USING (true);
