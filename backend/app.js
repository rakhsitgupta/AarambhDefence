const taskRoutes = require('./routes/taskRoutes');
const mocktestRoutes = require('./routes/mocktestRoutes');
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');

// Routes
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/mocktests', mocktestRoutes);
app.use('/api/v1/study-materials', studyMaterialRoutes); 