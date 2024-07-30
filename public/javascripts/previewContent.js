$(document).ready(function () {
    $('.view-details i').click(function () {
        var complaintId = $(this).data('complaint-id');
        $.ajax({
            type: 'POST',
            url: '/getComplaintDetails', // Endpoint to fetch complaint details
           
            data: { complaintId: complaintId },
            success: function (response) {
                $('.preview').html(response); // Display the response in the preview panel
                                                            
            },
            error: function (xhr, status, error) {
                
                alert('Error fetching complaint details.' + error.message);
            }
        });
    });
});

