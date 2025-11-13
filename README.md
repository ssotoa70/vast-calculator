# VAST Storage Capacity Calculator

A sophisticated web-based calculator for determining VAST storage capacity and performance metrics based on DBox configuration parameters. Supports multiple DBox models (Mavericks, HPE Alletra MP, Ceres, RAIDER) and configuration types with real-time calculations and side-by-side comparisons.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ssotoa70/vast-calculator/blob/main/LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](#testing)

## ✨ Features

- **📊 Real-time Calculations** - Instant capacity calculations as you adjust parameters
- **🔧 Multiple DBox Models** - Support for Mavericks, HPE Alletra MP, Ceres, and RAIDER
- **⚙️ Flexible Configurations** - Standard Layout and DBox-HA configuration types
- **🔀 Side-by-side Comparison** - Compare different configuration types and models
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Zero Dependencies** - Single HTML file with embedded CSS and JavaScript
- **🔒 100% Client-side** - All calculations performed locally, no server required
- **💾 Local Storage** - Automatically saves your preferences and configurations

## 🚀 Quick Start

### Option 1: Direct File Access
```bash
git clone https://github.com/ssotoa70/vast-calculator.git
cd vast-calculator
open index.html
```

### Option 2: Local Web Server
```bash
git clone https://github.com/ssotoa70/vast-calculator.git
cd vast-calculator
python3 -m http.server 8000
# Navigate to http://localhost:8000
```

### Option 3: Live Demo
Visit the live demo at: https://ssotoa70.github.io/vast-calculator/

## 📖 How to Use

### Basic Workflow

1. **Select DBox Model**
   - Choose from: Mavericks, HPE Alletra MP, Ceres, or RAIDER
   - Each model has different drive configurations (44 or 48 QLC drives)

2. **Configure Parameters**
   - **Disk Capacity**: Size of each QLC SSD drive (in TB)
   - **Number of DBoxes**: Use slider (1-250 DBoxes)
   - **Configuration Type**:
     - Standard Layout: Direct capacity calculation
     - DBox-HA: High-availability configuration with redundancy
   - **Overprovisioning**: Fine-tune system overhead percentages

3. **Review Results**
   - **Total Raw Capacity**: Sum of all drive capacities
   - **Effective Capacity**: Usable capacity after all overheads
   - **EC Overhead**: Erasure coding overhead percentage
   - **Storage Efficiency**: Overall efficiency ratio
   - **Bandwidth & IOPS**: Performance metrics

4. **Compare Configurations (Optional)**
   - Enable "Mixed Configuration" to compare two different setups
   - See side-by-side metrics and differences

### Example Calculation

**Input:**
- DBox Model: Mavericks
- Disk Capacity: 30.72 TB
- Number of DBoxes: 10
- Configuration: Standard Layout

**Output:**
- Raw Capacity: 13,516.80 TB
- Effective Capacity: ~11,000 TB
- Storage Efficiency: ~81%

## 🔍 Understanding the Calculations

### Supported DBox Models

| Model | QLC Drives | Use Case |
|-------|-----------|----------|
| **Mavericks** | 44 | Standard deployments |
| **HPE Alletra MP** | 44 | HPE-integrated environments |
| **Ceres** | 48 | High-capacity deployments |
| **RAIDER** | 48 | Performance-optimized |

### Calculation Formula (Step by Step)

#### Step 1: Raw Capacity
```
Raw Capacity per DBox = Disk Capacity (TB) × Drives per DBox
Total Raw Capacity = Raw Capacity per DBox × Number of DBoxes
```
**Example:** 30.72 TB × 44 drives × 10 DBoxes = 13,516.80 TB

#### Step 2: Apply System Overheads
```
System Overhead = Initial Provisioning (8%) + Dynamic Provisioning (1%) + Drive Overhead (0.23%)
Overhead Factor = (100 - System Overhead) / 100
Usable Capacity = Total Raw Capacity × Overhead Factor
```
**Example:** 13,516.80 TB × 0.9147 = 12,364.40 TB

#### Step 3: Erasure Coding (EC)
```
EC Overhead = (Parity Strips / Data Strips) × 100
```

**Standard Layout:**
- 1 DBox: 16 data strips → 4/16 = **25% overhead**
- 2 DBoxes: 36 data strips → 4/36 = **11.1% overhead**
- 10+ DBoxes: 146 data strips → 4/146 = **2.74% overhead**

**DBox-HA:**
- Formula: Data Strips = (DBoxes - 4) × 2
- Dynamic calculation based on actual DBox count

#### Step 4: File System Overhead
```
Additional Overhead = 7.3% to 8.88% (varies by configuration)
Total File System Overhead = EC Overhead + Additional Overhead
FS Factor = (100 - Total FS Overhead) / 100
Effective Capacity = Usable Capacity × FS Factor
```

#### Step 5: Storage Efficiency
```
Storage Efficiency = (Effective Capacity / Total Raw Capacity) × 100%
```

### System Overhead Values

- **Initial Provisioning**: 8.0% (for metadata and formatting)
- **Dynamic Provisioning**: 1.0% (reserved for system growth)
- **Drive Overhead**: 0.23% (firmware and system-reserved space)
- **Total System Overhead**: 9.23%

These values are based on VAST storage system specifications.

## 🏗️ Architecture

### Technology Stack

- **Language**: Vanilla JavaScript (ES6+)
- **Markup**: HTML5
- **Styling**: CSS3 with CSS Grid and Flexbox
- **Storage**: LocalStorage API for persistence
- **No External Dependencies**: Pure client-side application
- **File Size**: ~15KB (uncompressed)

### Code Structure

```
vast-calculator/
├── index.html                    # Single-file application
│   ├── <style>                  # Responsive UI styles
│   ├── <body>                   # HTML structure
│   └── <script>                 # Calculation engine
├── __tests__/
│   └── calculator.test.js       # Jest unit tests
├── e2e/
│   └── calculator.spec.js       # Playwright E2E tests
├── package.json                 # Project metadata
└── README.md                    # Documentation
```

### Browser Support

- Chrome/Chromium: ✅ (Latest 2 versions)
- Firefox: ✅ (Latest 2 versions)
- Safari: ✅ (Latest 2 versions)
- Edge: ✅ (Latest 2 versions)
- Mobile Browsers: ✅ (iOS Safari, Chrome Mobile)

### Responsive Design

- **Desktop** (1200px+): Two-column layout with comparisons
- **Tablet** (768px-1199px): Optimized two-column grid
- **Mobile** (<768px): Single-column stacked layout

## 🧪 Testing

### Unit Tests
```bash
npm test
```

Tests cover:
- Calculation accuracy for all DBox models
- Overhead calculations
- EC overhead formulas
- Edge cases (1 DBox, 250 DBoxes, etc.)
- Configuration comparisons

### End-to-End Tests
```bash
npm run test:e2e
```

Tests verify:
- User workflow (input → calculation → results)
- UI responsiveness on different screen sizes
- LocalStorage persistence
- Configuration comparison features

### Coverage Report
```bash
npm run test:coverage
```

## 🔧 Development

### Setup
```bash
git clone https://github.com/ssotoa70/vast-calculator.git
cd vast-calculator
npm install
```

### Run Tests
```bash
npm test              # Unit tests
npm run test:e2e     # E2E tests
npm run test:coverage # Coverage report
npm run test:watch   # Watch mode
```

### Code Quality
```bash
npm run lint          # Check and fix linting
npm run format        # Format code with Prettier
npm run build:check   # Run all checks before build
```

### Local Development Server
```bash
npm run serve
# Opens at http://localhost:8000
```

## ✏️ Customization

### Modify DBox Models
Edit the `DBOX_MODELS` constant in the `<script>` section:
```javascript
const DBOX_MODELS = {
  'mavericks': { name: 'Mavericks', qlc: 44 },
  'hpe-alletra-mp': { name: 'HPE Alletra MP', qlc: 44 },
  'ceres': { name: 'Ceres', qlc: 48 },
  'raider': { name: 'RAIDER', qlc: 48 }
};
```

### Adjust System Overheads
Modify the overhead values in `calculateForConfig()`:
```javascript
const initialOverprov = 8.0;    // Initial provisioning %
const dynamicOverprov = 1.0;    // Dynamic provisioning %
const driveOverhead = 0.23;     // Drive overhead %
```

### Change Display Format
Customize the `formatNumber()` function:
```javascript
function formatNumber(num, decimals = 2) {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
```

## 🎯 Use Cases

- **Capacity Planning**: Determine storage requirements for IT projects
- **Quote Generation**: Calculate effective capacity for customer proposals
- **System Design**: Compare different DBox configurations
- **What-if Analysis**: Test different deployment scenarios
- **Learning Tool**: Understand VAST storage system capacity calculations

## 🚀 Deployment

### GitHub Pages (Automatic)
Deployed automatically on every push to main:
```
https://ssotoa70.github.io/vast-calculator/
```

### Self-Hosted
Since this is a static site, you can host it anywhere:
- AWS S3 + CloudFront
- Netlify
- Vercel
- Any web server (Apache, Nginx, etc.)

### Docker
```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
EXPOSE 80
```

## 📊 Project Status

### Completed Features
- [x] Core calculation engine
- [x] Multi-model DBox support (4 models)
- [x] Real-time calculations
- [x] Responsive UI (desktop, tablet, mobile)
- [x] Side-by-side comparison
- [x] Mixed configuration support
- [x] LocalStorage persistence
- [x] Unit and E2E tests
- [x] Production CI/CD pipeline
- [x] Comprehensive documentation

### Future Enhancements
- [ ] Export results to PDF/CSV
- [ ] Historical comparison tracking
- [ ] Advanced visualization charts
- [ ] Cost calculator integration
- [ ] REST API for integrations
- [ ] Multi-language support
- [ ] Dark mode theme

## 📚 Documentation

- **This README** - Overview and quick start
- **[CALCULATIONS.md](./CALCULATIONS.md)** - Detailed calculation formulas
- **[DBOX_MODELS.md](./DBOX_MODELS.md)** - DBox model specifications
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Code structure and design
- **[API.md](./API.md)** - For future API integration

## 🔗 Related Resources

- **VAST Enterprise Storage**: [https://www.vastdata.com/](https://www.vastdata.com/)
- **Original Spreadsheet**: [EC Math 2.0](https://docs.google.com/spreadsheets/d/12SrjIeREE4U4qB9o_Z-BeDlPq5SeRbAJBf25-jErSJo/edit)
- **Linear Project**: [VAST Capacity Calculator](https://linear.app/dev-ss/project/vast-capacity-calculator-76e1a01ece4e)

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details.

### Summary
- You are free to use, modify, and distribute
- Must include copyright notice and license
- No warranty or liability

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add/update tests
5. Run `npm run build:check` to ensure quality
6. Commit your changes
7. Push to the branch
8. Open a Pull Request

## 📧 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/ssotoa70/vast-calculator/issues)
- **GitHub Discussions**: [Ask questions or discuss ideas](https://github.com/ssotoa70/vast-calculator/discussions)
- **Email**: ssotoa70@gmail.com
- **Twitter**: [@ssotoa70](https://twitter.com/ssotoa70)

## 🙏 Acknowledgments

- VAST Data for storage system specifications
- Original spreadsheet: EC Math 2.0
- Contributors and testers

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Maintained by**: Sergio Soto
**Repository**: https://github.com/ssotoa70/vast-calculator
