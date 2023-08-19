import schedule from "node-schedule"

// Регулярное обновление "Поста дня" (каждый день в полночь)
schedule.scheduleJob('10 * * * * *', async () => {
  try {
    console.log('Пост дня обновлен:');
  } catch (error) {
    console.error('Ошибка при обновлении поста дня:', error);
  }
});