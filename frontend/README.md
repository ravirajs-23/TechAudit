# Tech Audit Questionnaire Builder Frontend

A beautiful React-based interface for building comprehensive audit questionnaires using independent modules.

## 🚀 Features

### **Independent Module System**
- **Questions Management** - Create, edit, and delete audit questions independently
- **Sections Management** - Build sections with drag-and-drop functionality
- **Questionnaires Management** - Combine sections to create comprehensive questionnaires
- **Technologies Management** - Link questionnaires to specific technologies
- **Viewer/Preview** - Review complete hierarchical structure with expandable views

### **Key Features**
- ✨ **Beautiful UI** - Modern, responsive design with smooth animations
- 🔄 **Reusable Components** - Questions and sections can be reused across questionnaires
- 📱 **Mobile Responsive** - Works perfectly on all device sizes
- 🎯 **Evidence Requirements** - Questions with Yes/No/Optional evidence requirements
- 🔍 **Dual View Modes** - Hierarchy view for detailed structure, Summary view for overview
- ✏️ **Full CRUD Operations** - Create, Read, Update, and Delete for all components
- 🗂️ **Tab-Based Navigation** - Work on any module independently without forced workflow

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 📖 How to Use

### **Questions Tab**
- Click "Add New Question" to create audit questions
- Add guidance text to help auditors understand how to answer
- Set evidence requirements (Yes/No/Optional)
- **Edit existing questions** with inline editing capabilities
- **Delete questions** when no longer needed

### **Sections Tab**
- Select questions to group into logical sections
- Use drag-and-drop to organize questions
- Set section weights and descriptions
- **Edit section details** including title, description, and weight
- **Remove sections** with confirmation

### **Questionnaires Tab**
- Choose sections to include in your questionnaire
- Set version and description
- Create multiple questionnaires for different purposes
- **Modify questionnaire** properties and section assignments
- **Delete questionnaires** with cleanup

### **Technologies Tab**
- Link questionnaires to specific technologies
- Set technology details (name, version, vendor, risk level)
- Establish the complete audit structure
- **Update technology** details and questionnaire links
- **Remove technologies** from the system

### **Viewer Tab**
- **Hierarchy View**: Expandable tree structure showing the complete audit flow
- **Summary View**: Overview with statistics and scoring information
- Review the complete questionnaire before use

## 🎨 Design Features

### **Visual Elements**
- **Tab Navigation**: Clean, independent access to each module
- **Color Coding**: Different colors for evidence requirements and risk levels
- **Interactive Elements** - Hover effects, smooth transitions, and responsive feedback
- **Icons**: Intuitive emoji icons for better user experience

### **Responsive Design**
- **Desktop**: Full-featured interface with tab-based navigation
- **Tablet**: Optimized for medium screens with adjusted spacing
- **Mobile**: Stacked layouts with touch-friendly controls

## 🔧 Technical Details

### **Component Structure**
```
QuestionnaireBuilder/
├── QuestionnaireBuilder.js      # Main orchestrator with tab navigation
├── QuestionCreator.js           # Questions management (no weights/categories)
├── SectionBuilder.js            # Section building with question selection
├── QuestionnaireAssembler.js    # Questionnaire assembly
├── TechnologyConnector.js       # Technology connection
├── QuestionnaireViewer.js       # View and test (no question weights/categories)
└── CSS files for styling
```

### **State Management**
- Uses React hooks for local state management
- Each tab maintains independent state
- No forced dependencies between modules
- Users can work on any section at any time

### **Data Flow**
1. Questions are created independently (text, guidance, evidence requirements)
2. Sections are built by selecting existing questions
3. Questionnaires are assembled from selected sections
4. Technologies are connected to questionnaires
5. Complete structure is displayed in the viewer

## 🚀 Future Enhancements

### **Planned Features**
- **Backend Integration** - Connect to the Node.js API for data persistence
- **Template Library** - Pre-built questionnaires for common technologies
- **Export Functionality** - PDF and Excel export options
- **Collaboration** - Multi-user editing and sharing
- **Version Control** - Track changes and maintain questionnaire history

### **Advanced Features**
- **Audit Execution** - Conduct actual audits using built questionnaires
- **Reporting Engine** - Generate compliance reports and analytics
- **Workflow Management** - Approval processes and audit scheduling
- **Integration APIs** - Connect with external audit tools

## 🎯 Use Cases

### **Perfect For**
- **IT Auditors** - Building comprehensive audit checklists
- **Compliance Teams** - Creating regulatory compliance questionnaires
- **Security Teams** - Developing security assessment frameworks
- **Consultants** - Building reusable audit templates for clients
- **Internal Audit Teams** - Standardizing audit processes

### **Technology Types Supported**
- **Databases** - Oracle, SQL Server, MySQL, PostgreSQL
- **Web Applications** - Custom web apps, CMS platforms
- **Cloud Services** - AWS, Azure, Google Cloud
- **Network Infrastructure** - Routers, switches, firewalls
- **Mobile Applications** - iOS and Android apps

## 🤝 Contributing

This is a demonstration project showcasing modern React development practices. Feel free to:

- **Fork** the repository
- **Submit Issues** for bugs or feature requests
- **Create Pull Requests** for improvements
- **Share** with your team for feedback

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for the Tech Audit community**

