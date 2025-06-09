# Nintendo Product Monitor

A Discord bot that monitors Nintendo Store (Germany) products for stock availability and sends notifications when products come back in stock.

## Features

- 🔍 **Real-time Monitoring**: Continuously monitors Nintendo Store products for stock changes
- 🤖 **Discord Integration**: Sends embed notifications to Discord when products become available
- 📊 **Database Storage**: Tracks product information and stock status in PostgreSQL
- ⚡ **Slash Commands**: Easy to use Discord commands for managing monitored products
- 🛡️ **Error Handling**: Robust error handling with automatic restart capabilities
- ⏰ **Configurable Intervals**: Adjustable monitoring intervals for different scenarios

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Discord Bot Token and Application

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nintendo-product-monitor.git
   cd nintendo-product-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Create PostgreSQL database and run the schema
   psql -U your_username -d postgres -f database.sql
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nintendomonitor

   DISCORD_BOT_TOKEN=your_bot_token
   DISCORD_APPLICATION_ID=your_application_id
   DISCORD_GUILD_ID=your_guild_id
   DISCORD_CHANNEL_ID=your_channel_id
   ```

5. **Deploy Discord commands**
   ```bash
   node src/deploy-commands.js
   ```

6. **Start the monitor**
   ```bash
   node src/monitor.js
   ```

## Discord Commands

| Command | Description | Parameters |
|---------|-------------|------------|
| `/addproduct` | Add a product to monitoring | `product`: Nintendo product ID |
| `/removeproduct` | Remove a product from monitoring | `product`: Nintendo product ID |
| `/showproducts` | Display all monitored products | None |

## Configuration

### Monitoring Intervals

You can adjust monitoring intervals in `src/monitor.js`:

```javascript
const delay_mid = 300000;    // 5 minutes
const delay_short = 5000;    // 5 seconds  
const delay_normal = 180000; // 3 minutes (default)
```

### Database Schema

The application uses a single table `monitor_products`:

```sql
CREATE TABLE monitor_products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(250) NOT NULL,
  product_price VARCHAR(50),
  product_path VARCHAR(500),
  product_img VARCHAR(500),
  is_instock BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMP DEFAULT NOW()
);
```

## How It Works

1. **Product Monitoring**: The bot fetches product data from Nintendo Store API using product IDs
2. **Stock Detection**: Compares current stock status with stored database status
3. **Discord Notifications**: Sends embed messages when products go from out-of-stock to in-stock
4. **Database Updates**: Updates stock status in the database for future comparisons

## Finding Product IDs

To monitor a product, you need its Nintendo Store product ID:

1. Visit the Nintendo Store Germany website
2. Navigate to the product page
3. The product ID can be found in the URL or by inspecting network requests
4. Examples:
   - Nintendo Switch 2: `000000000010015151`
   - Mario Kart World: `70010000096802`

## Error Handling

The application includes comprehensive error handling:

- **API Timeouts**: 10 second timeout for Nintendo Store API requests
- **Database Errors**: Graceful handling of database connection issues
- **Discord Errors**: Continues monitoring even if Discord notifications fail
- **Automatic Restart**: Monitor automatically restarts after errors
- **Heartbeat Logging**: Regular status updates every 5 minutes

## Production Deployment

For production use, consider using a process manager like PM2:

```bash
npm install -g pm2
pm2 start src/monitor.js --name nintendo-monitor
pm2 startup
pm2 save
```

## File Structure

```
nintendo-product-monitor/
├── src/
│   ├── commands/
│   │   ├── addProductCommand.js
│   │   ├── removeProductCommand.js
│   │   └── showAllProductsCommand.js
│   ├── db.js
│   ├── deploy-commands.js
│   ├── manageProducts.js
│   └── monitor.js
├── database.sql
├── package.json
├── .env.example
└── README.md
```

## Screenshots
<img width="421" alt="image" src="https://github.com/user-attachments/assets/fc248e01-6834-43a8-9ebf-a578f97010ea" />
<br>
<img width="437" alt="image" src="https://github.com/user-attachments/assets/35e251e5-8fbf-447c-9ddf-b4ec8c2c6c11" />



## Dependencies

- **discord.js**: Discord API wrapper
- **axios**: HTTP client for Nintendo Store API
- **pg**: PostgreSQL client
- **dotenv**: Environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Disclaimer

This bot is for educational purposes only. Please respect Nintendo's terms of service and rate limits when using this application.
