// BaleTracker Web Application Logic

document.addEventListener('DOMContentLoaded', function() {
    const baleForm = document.getElementById('bale-form');
    const baleTable = document.getElementById('bale-table').getElementsByTagName('tbody')[0];
    const totalBalesEl = document.getElementById('total-bales');
    const totalWeightEl = document.getElementById('total-weight');
    const avgWeightEl = document.getElementById('avg-weight');
    
    // Load bales from localStorage or initialize empty array
    let bales = JSON.parse(localStorage.getItem('hayBales')) || [];
    
    // Update UI with current data
    function updateUI() {
        // Update table
        baleTable.innerHTML = '';
        
        bales.forEach((bale, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${bale.id}</td>
                <td>${bale.weight.toFixed(1)} kg</td>
                <td>${bale.date}</td>
                <td>
                    <button class="action-btn edit" data-index="${index}">Edit</button>
                    <button class="action-btn delete" data-index="${index}">Delete</button>
                </td>
            `;
            
            baleTable.appendChild(row);
        });
        
        // Update statistics
        const totalBales = bales.length;
        const totalWeight = bales.reduce((sum, bale) => sum + bale.weight, 0);
        const avgWeight = totalBales > 0 ? (totalWeight / totalBales) : 0;
        
        totalBalesEl.textContent = totalBales;
        totalWeightEl.textContent = totalWeight.toFixed(1);
        avgWeightEl.textContent = avgWeight.toFixed(1);
        
        // Save to localStorage
        localStorage.setItem('hayBales', JSON.stringify(bales));
    }
    
    // Handle form submission
    baleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const baleId = document.getElementById('bale-id').value.trim();
        const weight = parseFloat(document.getElementById('weight').value);
        const date = document.getElementById('date').value;
        
        // Validation
        if (!baleId || isNaN(weight) || weight <= 0 || !date) {
            alert('Please fill in all fields correctly');
            return;
        }
        
        // Check for duplicate ID
        if (bales.some(bale => bale.id.toLowerCase() === baleId.toLowerCase())) {
            alert('A bale with this ID already exists');
            return;
        }
        
        // Add new bale
        bales.push({
            id: baleId,
            weight: weight,
            date: date
        });
        
        // Reset form
        baleForm.reset();
        
        // Update UI
        updateUI();
    });
    
    // Handle table clicks (using event delegation)
    baleTable.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            
            if (confirm('Are you sure you want to delete this bale?')) {
                bales.splice(index, 1);
                updateUI();
            }
        }
        
        if (e.target.classList.contains('edit')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            const bale = bales[index];
            
            // Populate form with bale data for editing
            document.getElementById('bale-id').value = bale.id;
            document.getElementById('weight').value = bale.weight;
            document.getElementById('date').value = bale.date;
            
            // Remove the bale from array (will be re-added on form submit)
            bales.splice(index, 1);
            updateUI();
        }
    });
    
    // Initialize UI
    updateUI();
});
