$('.aboutSkillCircle').on('click', function() {
    $(this).addClass('aboutSkillCircleOpen');
    return false;
}).on('click', '.aboutSkillClose', function() {
    $(this).parents('.aboutSkillCircle').removeClass('aboutSkillCircleOpen');
    return false;
})